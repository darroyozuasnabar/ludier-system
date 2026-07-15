import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

// 🔥 Inicializar Resend con la API Key desde .env.local
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { nombre, email, telefono, asunto, mensaje } = body;

    // 🔥 Validar campos requeridos
    if (!nombre || !email || !asunto || !mensaje) {
      return NextResponse.json(
        { error: 'Todos los campos obligatorios deben estar completos' },
        { status: 400 }
      );
    }

    // 🔥 Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'El correo electrónico no es válido' },
        { status: 400 }
      );
    }

    // ============================================================
    // 1. CORREO PARA EL CLIENTE (confirmación de recepción)
    // 🔥 Usamos el dominio de prueba "onboarding@resend.dev"
    // ============================================================
    const clientEmail = await resend.emails.send({
      from: 'LUDIER - Construcciones Generales <onboarding@resend.dev>',
      to: email,
      subject: `Hemos recibido tu mensaje - ${asunto}`,
      html: `
        <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background: #F7F7F4; border-radius: 8px;">
          <div style="background: #14161A; padding: 20px; border-radius: 8px 8px 0 0; text-align: center;">
            <h1 style="color: #FF5A1F; font-family: 'Oswald', sans-serif; font-size: 28px; margin: 0;">LUDIER</h1>
            <p style="color: #8A8F96; margin: 0; font-size: 14px;">Construcciones Generales</p>
          </div>
          <div style="background: white; padding: 30px; border-radius: 0 0 8px 8px; border: 1px solid #E3E1D8; border-top: none;">
            <h2 style="color: #1E2126; font-size: 20px; margin-top: 0;">¡Hola ${nombre}!</h2>
            <p style="color: #565C63; font-size: 16px; line-height: 1.6;">
              Hemos recibido tu mensaje con el asunto: <strong>"${asunto}"</strong>.
            </p>
            <p style="color: #565C63; font-size: 16px; line-height: 1.6;">
              Tu mensaje ha sido enviado a nuestro equipo y te responderemos en menos de 24 horas.
            </p>
            <div style="background: #F7F7F4; padding: 16px; border-radius: 4px; margin: 20px 0; border-left: 4px solid #FF5A1F;">
              <p style="margin: 0; color: #565C63; font-size: 15px; font-style: italic;">
                "${mensaje}"
              </p>
            </div>
            <p style="color: #565C63; font-size: 14px; line-height: 1.6;">
              Si tienes alguna urgencia, no dudes en llamarnos al <strong>+51 930 747 399</strong> o escribirnos por WhatsApp.
            </p>
            <hr style="border: none; border-top: 1px solid #E3E1D8; margin: 24px 0;" />
            <p style="color: #8B8F86; font-size: 12px; text-align: center; margin: 0;">
              Este es un correo automático de confirmación. Por favor, no respondas a este mensaje.
            </p>
          </div>
        </div>
      `,
    });

    // ============================================================
    // 2. CORREO PARA LA EMPRESA (notificación de nuevo mensaje)
    // 🔥 También usamos el dominio de prueba
    // ============================================================
    const empresaEmail = await resend.emails.send({
      from: 'LUDIER - Contacto Web <onboarding@resend.dev>',
      to: 'ernestoarroyo1969@hotmail.com',
      subject: `Nuevo mensaje de contacto - ${asunto}`,
      html: `
        <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background: #F7F7F4; border-radius: 8px;">
          <div style="background: #14161A; padding: 20px; border-radius: 8px 8px 0 0; text-align: center;">
            <h1 style="color: #FF5A1F; font-family: 'Oswald', sans-serif; font-size: 28px; margin: 0;">Nuevo mensaje de contacto</h1>
          </div>
          <div style="background: white; padding: 30px; border-radius: 0 0 8px 8px; border: 1px solid #E3E1D8; border-top: none;">
            <p style="color: #565C63; font-size: 16px;">
              Has recibido un nuevo mensaje desde el formulario de contacto de LUDIER.
            </p>
            <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #1E2126; width: 100px;">Nombre:</td>
                <td style="padding: 8px 0; color: #565C63;">${nombre}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #1E2126;">Email:</td>
                <td style="padding: 8px 0; color: #565C63;"><a href="mailto:${email}">${email}</a></td>
              </tr>
              ${telefono ? `<tr><td style="padding: 8px 0; font-weight: bold; color: #1E2126;">Teléfono:</td><td style="padding: 8px 0; color: #565C63;">${telefono}</td></tr>` : ''}
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #1E2126;">Asunto:</td>
                <td style="padding: 8px 0; color: #565C63;">${asunto}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #1E2126; vertical-align: top;">Mensaje:</td>
                <td style="padding: 8px 0; color: #565C63;">${mensaje}</td>
              </tr>
            </table>
            <hr style="border: none; border-top: 1px solid #E3E1D8; margin: 24px 0;" />
            <p style="color: #8B8F86; font-size: 12px; text-align: center; margin: 0;">
              Este correo fue enviado automáticamente desde el formulario de contacto de ludier.com.
            </p>
          </div>
        </div>
      `,
    });

    console.log('✅ Correo enviado al cliente:', clientEmail);
    console.log('✅ Correo enviado a la empresa:', empresaEmail);

    return NextResponse.json(
      { message: 'Mensaje enviado correctamente' },
      { status: 200 }
    );
  } catch (error) {
    console.error('❌ Error al enviar correos:', error);
    return NextResponse.json(
      { error: 'Error al enviar el mensaje. Inténtalo nuevamente.' },
      { status: 500 }
    );
  }
}