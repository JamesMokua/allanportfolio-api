import prisma from "../db";

export const getOneUpdate = async (req, res) => {
  const update = await prisma.update.findUnique({
    where: {
      id: req.params.id,
    },
  });
  res.json({ data: update });
};
export const getUpdates = async (req, res) => {
  const projects = await prisma.project.findMany({
    where: {
      belongsToId: req.user.id,
    },
    include: {
      updates: true,
    },
  });
  //not recommended(update schema instead)
  const updates = projects.reduce((allUpdates, project) => {
    return [...allUpdates, ...project.updates];
  }, []);
  res.json({ data: updates });
};
export const createUpdate = async (req, res) => {
 
  const project = await prisma.project.findUnique({
    where: {
        id: req.body.projectId,
    },
  })
  if (!project) {
    //does not belong to user
    res.status(401);
    res.json({ message: "Not Authorized" });
    return;
  }
  const update = await prisma.update.create({
    data: {
      title: req.body.title,
      content: req.body.content,
      status: req.body.status,
      country: req.body.country,
      image: req.body.image,
      version: req.body.version,
      project: { connect: { id: project.id } }
    },
  });
  res.json({ data: update });
};
export const updateUpdate = async (req, res) => {
  const projects = await prisma.project.findMany({
    where: {
      belongsToId: req.user.id,
    },
    include: {
      updates: true,
    },
  });
  const updates = projects.reduce((allUpdates, project) => {
    return [...allUpdates, ...project.updates];
  }, []);
  res.json({ data: updates });

  const match = updates.find((update) => {
    return update.id === req.params.id;
  });
  if (!match) {
    res.status(401);
    res.json({ message: "Not Authorized" });
    return;
  }
  const updatedUpdate = await prisma.update.update({
    where: {
      id: req.params.id,
    },
    data: {
      title: req.body.title,
      content: req.body.content,
      status: req.body.status,
      country: req.body.country,
      image: req.body.image,
      version: req.body.version,
      projectId: req.body.projectId,
    },
  });
  res.json({ data: updatedUpdate });
};
export const deleteUpdate = async (req, res) => {
  const projects = await prisma.project.findMany({
    where: {
      belongsToId: req.user.id,
    },
    include: {
      updates: true,
    },
  });
  const updates = projects.reduce((allUpdates, project) => {
    return [...allUpdates, ...project.updates];
  }, []);
  res.json({ data: updates });

  const match = updates.find((update) => {
    return update.id === req.params.id;
  });
  if (!match) {
    res.status(401);
    res.json({ message: "Not Authorized" });
    return;
  }
  const deletedUpdate = await prisma.update.delete({
    where: {
      id: req.params.id,
    },
  });
  res.json({ data: deletedUpdate });
};
