import { Link } from 'react-router-dom'

export default function Footer() {
    return (
        <footer className="bg-neutral-950 border-t border-neutral-800 mt-auto">
            <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row justify-between gap-8">

                <div className="flex flex-col gap-3">
                    <span className="text-white font-semibold text-lg tracking-widest uppercase">Ymmo</span>
                    <p className="text-neutral-500 text-sm max-w-xs">
                        Plateforme immobilière premium pour l'achat et la vente de biens résidentiels et professionnels.
                    </p>
                </div>

                <div className="flex flex-col gap-3">
                    <span className="text-neutral-300 text-sm font-medium uppercase tracking-wider">Navigation</span>
                    <Link to="/properties" className="text-neutral-500 hover:text-white text-sm transition-colors">Annonces</Link>
                    <Link to="/auth" className="text-neutral-500 hover:text-white text-sm transition-colors">Connexion</Link>
                </div>

                <div className="flex flex-col gap-3">
                    <span className="text-neutral-300 text-sm font-medium uppercase tracking-wider">Légal</span>
                    <span className="text-neutral-500 text-sm">Mentions légales</span>
                    <span className="text-neutral-500 text-sm">Politique de confidentialité</span>
                </div>

            </div>

            <div className="max-w-7xl mx-auto px-6 py-4 border-t border-neutral-800">
                <p className="text-neutral-600 text-xs">© {new Date().getFullYear()} Ymmo. Tous droits réservés.</p>
            </div>
        </footer>
    )
}