 import * as user from '../user'
 describe('user handler', () => {
    it('should create a new user', async () => {
        const req = {body: {name: 'test', password: 'test'}}
        const res = {json({token}) {
            expect(token).toBeTruthy()
        }}
        const newUser = await user.createNewUser(req,res, () => {})
    })
 })