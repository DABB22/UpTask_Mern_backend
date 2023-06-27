
import nodemailer from 'nodemailer'

export const emailRegistro = async ({nombre, email, token}) => {

    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    //Información del email
    const info = await transport.sendMail({
        from: '"UpTask - Administrador De Proyectos" <admin@uptask.com>',
        to: email,
        subject: "Registro UpTask - Confirmar Cuenta",
        text: "Comprueba tu cuenta en UpTask",
        html: //para dar estilos debemos usar la forma lineal con el atributo style
        `
        <p>Hola <strong>${nombre}</strong> comprueba tu cuenta de UpTask</p>
        <p>Estás a un paso de activar tu cuenta y comenzar administrar tus proyectos!, accede al siguiente enlace:</p>
        <a href='${process.env.FRONTEND_URL}/confirmar/${token}'>comprobar cuenta</a>
        <p>Si tu no realizaste esta creación de cuenta por favor ignorar este mensaje</p>

        `
    })
}

export const emailResetPassword = async ({nombre, email, token}) => {

    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    //Información del email
    const info = await transport.sendMail({
        from: '"UpTask - Administrador De Proyectos" <admin@uptask.com>',
        to: email,
        subject: "UpTask - Solictud Resetear Contraseña",
        text: "Resetea tu contraseña de UpTask",
        html: //para dar estilos debemos usar la forma lineal con el atributo style
        `
        <p>Hola <strong>${nombre}</strong> realizaste una solicitud para resetar tu contraseña</p>
        <p>Para hacer efectivo el reset de tu contraseña debes acceder al siguiente enlace:</p>
        <a href='${process.env.FRONTEND_URL}/olvide-password/${token}'>Resetar Password</a>
        <p>Si tu no realizaste esta solicitud hacer caso omiso a este mensaje</p>

        `
    })
}