export default function Footer() {
    return (
        <footer style={{ backgroundColor: '#0D1F3C' }} className="py-12">
            <div className="max-w-7xl mx-auto px-8 lg:px-16 flex flex-col md:flex-row justify-between gap-10">
                <div>
                    <p className="text-lg font-semibold tracking-widest uppercase text-white mb-3">🏛 Ymmo</p>
                    <p className="text-sm" style={{ color: '#C5C6CE' }}>Contact : contact@ymmo.fr</p>
                    <p className="text-sm" style={{ color: '#C5C6CE' }}>Tél : +33 1 23 45 67 89</p>
                </div>
                <div className="flex gap-16">
                    <div className="flex flex-col gap-3">
                        <p className="text-xs tracking-widest uppercase text-white mb-1">Légal</p>
                        {['Mentions légales', 'Confidentialité', 'Cookies'].map((l) => (
                            <span key={l} className="text-sm cursor-pointer hover:text-white transition-colors" style={{ color: '#C5C6CE' }}>{l}</span>
                        ))}
                    </div>
                </div>
            </div>
            <div className="max-w-7xl mx-auto px-8 lg:px-16 mt-8 pt-6 border-t border-white/10">
                <p className="text-xs" style={{ color: '#C5C6CE' }}>© 2024 Ymmo. L'Excellence Immobilière.</p>
            </div>
        </footer>
    )
}