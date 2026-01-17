export const MOCK_LEADS = [
    {
        name: "LEAD-00001",
        lead_name: "Juan Pérez",
        title: "Instituto Tecnológico",
        mobile_no: "+52 55 1234 5678",
        email_id: "juan.perez@tech.edu.mx",
        status: "Lead",
        creation: "2024-03-20 10:30:00"
    },
    {
        name: "LEAD-00002",
        lead_name: "María Garcia",
        title: "Colegio Harvard",
        mobile_no: "+52 55 8765 4321",
        email_id: "m.garcia@harvard-school.mx",
        status: "Interested",
        creation: "2024-03-19 14:15:00"
    },
    {
        name: "LEAD-00003",
        lead_name: "Carlos López",
        title: "Universidad del Valle",
        mobile_no: "+52 55 1111 2222",
        email_id: "clopez@univalle.edu.mx",
        status: "Contacted",
        creation: "2024-03-18 09:45:00"
    }
];

export const MOCK_LEAD_DETAILS = {
    "LEAD-00001": {
        name: "LEAD-00001",
        lead_name: "Juan Pérez",
        first_name: "Juan",
        email_id: "juan.perez@tech.edu.mx",
        mobile_no: "+52 55 1234 5678",
        company: "Lumen Creativo",
        title: "Instituto Tecnológico",
        status: "Lead",
        source: "Website",
        territory: "All Territories",
        notes: "Interesado en renovación de marca y sitio web."
    }
};

export const MOCK_TIMELINE = [
    {
        subject: "Nota de Reunión",
        content: "Se discutieron los requerimientos iniciales. El cliente busca un diseño moderno.",
        communication_date: "2024-03-21 11:00:00",
        sender: "admin@lumencreativo.com"
    },
    {
        subject: "Correo Enviado",
        content: "Propuesta comercial enviada por correo electrónico.",
        communication_date: "2024-03-20 16:30:00",
        sender: "system@lumencreativo.com"
    }
];
