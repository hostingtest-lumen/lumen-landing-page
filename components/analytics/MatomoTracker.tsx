"use client";

import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

interface MatomoTrackerProps {
    siteId: string;
    matomoUrl: string;
}

export default function MatomoTracker({ siteId, matomoUrl }: MatomoTrackerProps) {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [initialized, setInitialized] = useState(false);

    useEffect(() => {
        // Evitar ejecutar en desarrollo si no se desea, o si faltan credenciales
        if (!siteId || !matomoUrl) return;

        // Inicializar Matomo si no está ya
        if (!window._paq) {
            window._paq = window._paq || [];
        }

        if (!initialized) {
            const _paq = window._paq;
            _paq.push(['trackPageView']);
            _paq.push(['enableLinkTracking']);

            (function () {
                // Asegurarse de que la URL termine en /
                const u = matomoUrl.endsWith('/') ? matomoUrl : matomoUrl + '/';
                _paq.push(['setTrackerUrl', u + 'matomo.php']);
                _paq.push(['setSiteId', siteId]);

                const d = document;
                const g = d.createElement('script');
                const s = d.getElementsByTagName('script')[0];
                g.async = true;
                g.src = u + 'matomo.js';
                if (s.parentNode) {
                    s.parentNode.insertBefore(g, s);
                }
                setInitialized(true);
            })();
        } else {
            // En cambios de ruta posteriores
            const _paq = window._paq;
            _paq.push(['setCustomUrl', window.location.pathname + window.location.search]);
            _paq.push(['setDocumentTitle', document.title]);
            _paq.push(['trackPageView']);
        }

    }, [pathname, searchParams, siteId, matomoUrl, initialized]);

    return null;
}

declare global {
    interface Window {
        _paq: any[];
    }
}
