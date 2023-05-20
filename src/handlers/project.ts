import prisma from "../db";

//get all projects
export const getProjects = async (req,res) => {
const user = await prisma.administratorUser.findUnique({
    where: {
        id: req.user.id,
    },
    include: {
        Projects: true,
    }
})
res.json({data: user.Projects})
};
//get one project
export const getOneProject = async (req,res) => {
    const project = await prisma.project.findFirst({
        where: {
            id: req.params.id,
            belongsToId: req.user.id,
        }
    })
    res.json({data: project})
};

//create a project
export const createProject = async (req,res,next) => {
    try {
       const project = await prisma.project.create({
        data: {
            name: req.body.name,
            description: req.body.description,
            images: req.body.images,
            countries: req.body.countries,
            belongsToId: req.user.id,
        }
    })
    res.json({data: project})   
    } catch (error) {
        next(error)
    }
  
}

//update a project
export const updateProject = async (req,res) => {
    const id = req.params.id
    const updated = await prisma.project.update({
        where: {
            id_belongsToId: {
                id: id,
                belongsToId: req.user.id,
           }
        },
        data: {
            name: req.body.name,
            description: req.body.description,
            countries: req.body.countries,
            images: req.body.images,
        }
    })
    res.json({data: updated})
}

//delete a project
export const deleteProject = async (req,res) => {
    const id = req.params.id
    const deleted = await prisma.project.delete({
        where: {
           id_belongsToId: {
                id: id,
                belongsToId: req.user.id,
           }
        }
    })
    res.json({data: deleted})
}
