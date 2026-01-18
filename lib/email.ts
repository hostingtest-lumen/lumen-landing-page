import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface LeadEmailData {
    nombre: string;
    email: string;
    whatsapp: string;
    institucion?: string;
    instagram?: string;
    necesidad?: string;
    leadId: string;
}

// Email de confirmación para el lead
export async function sendLeadConfirmationEmail(data: LeadEmailData) {
    const { nombre, email } = data;

    try {
        const { data: emailData, error } = await resend.emails.send({
            from: 'Lumen Creativo <onboarding@resend.dev>',
            to: email,
            subject: '✨ Recibimos tu mensaje - Lumen Creativo',
            html: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8f8f8;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8f8f8; padding: 40px 20px;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08);">
                    <!-- Header -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #7C3AED 0%, #2563EB 100%); padding: 40px; text-align: center;">
                            <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700;">
                                Lumen Creativo
                            </h1>
                            <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0 0; font-size: 14px;">
                                Iluminamos tu marca
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Body -->
                    <tr>
                        <td style="padding: 48px 40px;">
                            <h2 style="color: #1a1a1a; margin: 0 0 24px 0; font-size: 24px;">
                                ¡Hola ${nombre}! 👋
                            </h2>
                            
                            <p style="color: #4a4a4a; font-size: 16px; line-height: 1.7; margin: 0 0 20px 0;">
                                Gracias por contactarnos. Recibimos tu mensaje y estamos emocionados de conocer más sobre tu proyecto.
                            </p>
                            
                            <p style="color: #4a4a4a; font-size: 16px; line-height: 1.7; margin: 0 0 20px 0;">
                                Nuestro equipo revisará tu caso y te responderemos en las próximas <strong style="color: #7C3AED;">24 horas hábiles</strong> con una propuesta personalizada.
                            </p>
                            
                            <div style="background: linear-gradient(135deg, #f8f4ff 0%, #eef4ff 100%); border-radius: 12px; padding: 24px; margin: 32px 0;">
                                <p style="color: #6b21a8; font-size: 14px; font-weight: 600; margin: 0 0 8px 0;">
                                    ¿Qué sigue?
                                </p>
                                <ul style="color: #4a4a4a; font-size: 15px; line-height: 1.8; margin: 0; padding-left: 20px;">
                                    <li>Analizaremos tus necesidades</li>
                                    <li>Prepararemos una propuesta a tu medida</li>
                                    <li>Te contactaremos para agendar una llamada</li>
                                </ul>
                            </div>
                            
                            <p style="color: #4a4a4a; font-size: 16px; line-height: 1.7; margin: 0;">
                                Mientras tanto, puedes seguirnos en Instagram para ver nuestro trabajo reciente.
                            </p>
                        </td>
                    </tr>
                    
                    <!-- CTA -->
                    <tr>
                        <td style="padding: 0 40px 48px 40px; text-align: center;">
                            <a href="https://instagram.com/lumencreativo.lat" style="display: inline-block; background: linear-gradient(135deg, #7C3AED 0%, #2563EB 100%); color: #ffffff; text-decoration: none; padding: 16px 32px; border-radius: 30px; font-weight: 600; font-size: 15px;">
                                Síguenos en Instagram →
                            </a>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #f8f8f8; padding: 24px 40px; text-align: center; border-top: 1px solid #eee;">
                            <p style="color: #888; font-size: 13px; margin: 0;">
                                © ${new Date().getFullYear()} Lumen Creativo. Todos los derechos reservados.
                            </p>
                            <p style="color: #aaa; font-size: 12px; margin: 8px 0 0 0;">
                                Este email fue enviado porque completaste nuestro formulario de contacto.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
            `,
        });

        if (error) {
            console.error('❌ Error enviando email de confirmación:', error);
            return { success: false, error };
        }

        console.log('📧 Email de confirmación enviado:', emailData?.id);
        return { success: true, id: emailData?.id };
    } catch (error) {
        console.error('❌ Error crítico enviando email:', error);
        return { success: false, error };
    }
}

// Email de notificación para el equipo
export async function sendTeamNotificationEmail(data: LeadEmailData) {
    const { nombre, email, whatsapp, institucion, instagram, necesidad, leadId } = data;

    try {
        const { data: emailData, error } = await resend.emails.send({
            from: 'Lumen Bot <onboarding@resend.dev>',
            to: ['hostingtest.lumen@gmail.com'], // Agregar más emails del equipo aquí
            subject: `🚀 Nuevo Lead: ${nombre} - ${institucion || 'Sin institución'}`,
            html: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #1a1a1a;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #1a1a1a; padding: 40px 20px;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #242424; border-radius: 16px; overflow: hidden; border: 1px solid #333;">
                    <!-- Header -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #7C3AED 0%, #2563EB 100%); padding: 24px; text-align: center;">
                            <h1 style="color: #ffffff; margin: 0; font-size: 20px; font-weight: 600;">
                                🚀 Nuevo Lead Recibido
                            </h1>
                        </td>
                    </tr>
                    
                    <!-- Body -->
                    <tr>
                        <td style="padding: 32px;">
                            <table width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td style="padding: 12px 0; border-bottom: 1px solid #333;">
                                        <span style="color: #888; font-size: 12px; text-transform: uppercase;">Nombre</span><br>
                                        <span style="color: #fff; font-size: 16px; font-weight: 500;">${nombre}</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 12px 0; border-bottom: 1px solid #333;">
                                        <span style="color: #888; font-size: 12px; text-transform: uppercase;">Institución</span><br>
                                        <span style="color: #fff; font-size: 16px; font-weight: 500;">${institucion || 'No especificada'}</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 12px 0; border-bottom: 1px solid #333;">
                                        <span style="color: #888; font-size: 12px; text-transform: uppercase;">Email</span><br>
                                        <a href="mailto:${email}" style="color: #7C3AED; font-size: 16px; text-decoration: none;">${email}</a>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 12px 0; border-bottom: 1px solid #333;">
                                        <span style="color: #888; font-size: 12px; text-transform: uppercase;">WhatsApp</span><br>
                                        <a href="https://wa.me/${whatsapp.replace(/\D/g, '')}" style="color: #22c55e; font-size: 16px; text-decoration: none;">${whatsapp}</a>
                                    </td>
                                </tr>
                                ${instagram ? `
                                <tr>
                                    <td style="padding: 12px 0; border-bottom: 1px solid #333;">
                                        <span style="color: #888; font-size: 12px; text-transform: uppercase;">Instagram</span><br>
                                        <a href="https://instagram.com/${instagram.replace('@', '')}" style="color: #e879f9; font-size: 16px; text-decoration: none;">${instagram}</a>
                                    </td>
                                </tr>
                                ` : ''}
                                <tr>
                                    <td style="padding: 16px 0;">
                                        <span style="color: #888; font-size: 12px; text-transform: uppercase;">Necesidad</span><br>
                                        <p style="color: #ccc; font-size: 15px; line-height: 1.6; margin: 8px 0 0 0; background: #1a1a1a; padding: 16px; border-radius: 8px;">
                                            ${necesidad || 'No especificada'}
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    
                    <!-- CTA -->
                    <tr>
                        <td style="padding: 0 32px 32px 32px; text-align: center;">
                            <a href="http://lumen.local:3000/dashboard/leads" style="display: inline-block; background: linear-gradient(135deg, #7C3AED 0%, #2563EB 100%); color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: 600; font-size: 14px; margin-right: 12px;">
                                Ver en Dashboard
                            </a>
                            <a href="https://wa.me/${whatsapp.replace(/\D/g, '')}" style="display: inline-block; background: #22c55e; color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: 600; font-size: 14px;">
                                Contactar por WhatsApp
                            </a>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #1a1a1a; padding: 16px 32px; text-align: center; border-top: 1px solid #333;">
                            <p style="color: #666; font-size: 12px; margin: 0;">
                                Lead ID: ${leadId} • ${new Date().toLocaleString('es-DO')}
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
            `,
        });

        if (error) {
            console.error('❌ Error enviando email al equipo:', error);
            return { success: false, error };
        }

        console.log('📧 Email de notificación al equipo enviado:', emailData?.id);
        return { success: true, id: emailData?.id };
    } catch (error) {
        console.error('❌ Error crítico enviando email al equipo:', error);
        return { success: false, error };
    }
}

interface DeliverableStatusData {
    clientName: string;
    title: string;
    status: 'approved' | 'changes_requested';
    feedback?: string;
    deliverableId: string;
}

export async function sendDeliverableStatusEmail(data: DeliverableStatusData) {
    const { clientName, title, status, feedback, deliverableId } = data;
    const isApproved = status === 'approved';
    const statusText = isApproved ? '✅ APROBADO' : '⚠️ CAMBIOS SOLICITADOS';
    const color = isApproved ? '#22c55e' : '#f59e0b';

    try {
        await resend.emails.send({
            from: 'Lumen Portal <onboarding@resend.dev>',
            to: ['hostingtest.lumen@gmail.com'],
            subject: `[${clientName}] ${statusText}: ${title}`,
            html: `
            <h1>Actualización de Diseño</h1>
            <p><strong>Cliente:</strong> ${clientName}</p>
            <p><strong>Diseño:</strong> ${title}</p>
            <p style="color: ${color}; font-weight: bold;">Estado: ${statusText}</p>
            ${feedback ? `<p><strong>Comentarios:</strong><br>${feedback}</p>` : ''}
            <br>
            <a href="http://lumen.local:3000/dashboard/deliverables">Ver en Dashboard</a>
            `
        });
        return { success: true };
    } catch (e) {
        console.error("Error sending deliverable email", e);
        return { success: false };
    }
}
