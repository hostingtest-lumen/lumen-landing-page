import Link from "next/link";
import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react";

const Footer = () => {
    return (
        <footer className="bg-lumen-black text-lumen-light pt-16 pb-8">
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
                    {/* Brand */}
                    <div className="col-span-1 md:col-span-1">
                        <h3 className="font-serif text-2xl font-bold text-white mb-4 flex items-center gap-2">
                            Lumen Creativo <span>💡</span>
                        </h3>
                        <p className="text-sm text-gray-400 mb-6">
                            Iluminamos proyectos que transforman el mundo con tecnología y propósito.
                        </p>
                        <div className="flex gap-4">
                            <Link href="#" className="text-lumen-main hover:text-lumen-energy transition-colors">
                                <Instagram size={20} />
                            </Link>
                            <Link href="#" className="text-lumen-main hover:text-lumen-energy transition-colors">
                                <Linkedin size={20} />
                            </Link>
                            <Link href="#" className="text-lumen-main hover:text-lumen-energy transition-colors">
                                <Twitter size={20} />
                            </Link>
                            <Link href="#" className="text-lumen-main hover:text-lumen-energy transition-colors">
                                <Facebook size={20} />
                            </Link>
                        </div>
                    </div>

                    {/* Links */}
                    <div>
                        <h4 className="font-semibold text-white mb-4">Explorar</h4>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li><Link href="#servicios" className="hover:text-lumen-energy">Servicios</Link></li>
                            <li><Link href="#academia" className="hover:text-lumen-energy">Academia</Link></li>
                            <li><Link href="#casos" className="hover:text-lumen-energy">Casos de Éxito</Link></li>
                            <li><Link href="#contacto" className="hover:text-lumen-energy">Contacto</Link></li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h4 className="font-semibold text-white mb-4">Legal</h4>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li><Link href="/privacidad" className="hover:text-lumen-energy">Política de Privacidad</Link></li>
                            <li><Link href="/terminos" className="hover:text-lumen-energy">Términos de Servicio</Link></li>
                        </ul>
                    </div>

                    {/* Quote */}
                    <div>
                        <div className="border-l-2 border-lumen-main pl-4 py-2">
                            <p className="text-sm italic text-gray-300">
                                "La luz brilla en las tinieblas, y las tinieblas no la vencieron."
                            </p>
                            <p className="text-xs text-lumen-main mt-2 font-semibold">— Juan 1:5</p>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
                    <p>&copy; {new Date().getFullYear()} Lumen Creativo. Todos los derechos reservados.</p>
                    <p className="mt-2 md:mt-0">Diseñado con <span className="text-red-500">♥</span> y Fe.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
