const usuarioService = require('@services/usuarioService') 
const jwt = require('@helpers/jwt')

exports.PostLogin = async (req, res, next) =>{

    let usuario = {
        username: req.body.username, 
        password: req.body.password
    } 

    resultado = await usuarioService.Login(usuario)
    if(resultado.length == 0) return await res.status(404).json({error: {auth: false, message:  'Usuario não encontrado'}})

    const token = jwt.GerarToken(resultado[0].id_user)
    res.header('authorization', token)
    return await res.status(200).json({
        auth: true, message: 'Sucesso!', usuario:{
            id: resultado[0].id_user,
            username : req.body.username
        }
    })

}

exports.PostCadastrar = async (req, res, next) =>{

    let usuario = {
        username: req.body.username, 
        password:req.body.password
    } 
    if(!usuario.username || !usuario.password) return res.status(400).json({error: { auth: false, message: "Um ou mais campos vazios."}})

    let resultado = await usuarioService.BuscarUsuarioPeloNome(usuario.username)
    if(resultado.length > 0) return res.status(404).json({error: { auth: false, message: "Usuario inválido." }})    

    resultado = await usuarioService.Cadastrar(usuario)

    return await res.status(200).json({
        auth: true, message: 'Sucesso!'
    })

}
