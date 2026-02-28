import { useEffect, useContext } from 'react';
import { AppContext } from '../../contexts/AppContext';
import { useLocalStorage } from '../../hooks/useLocalStorage';

const TutorialContent = () => (
    <div className="space-y-4 text-left text-base">
        <p>Ini adalah area belajar interaktif Anda. Berikut beberapa tips untuk memulai:</p>
        <ul className="list-disc list-inside space-y-3">
            <li>
                <strong className="text-teal-400">Klik sekali</strong> pada sebuah kata untuk menampilkan/menyembunyikan <strong className="font-semibold">harakat</strong> atau <strong className="font-semibold">terjemahannya</strong>, tergantung mode yang aktif.
            </li>
            <li>
                <strong className="text-teal-400">Klik dua kali</strong> pada sebuah kata untuk melihat <strong className="font-semibold">I'rab</strong> (analisis gramatikal) lengkapnya.
            </li>
            <li>
                Gunakan tombol <strong className="font-semibold">Pengaturan Tampilan</strong> (ikon slider) di kanan atas untuk menyesuaikan ukuran teks dan mengaktifkan <strong className="font-semibold">Mode Fokus</strong>.
            </li>
        </ul>
        <p className="text-center pt-4">Selamat belajar!</p>
    </div>
);

const Tutorial = ({ setSliderState }) => {
    const [hasSeenTutorial, setHasSeenTutorial] = useLocalStorage('hasSeenTutorial', false);

    useEffect(() => {
        if (!hasSeenTutorial) {
            const timer = setTimeout(() => {
                setSliderState({
                    isOpen: true,
                    title: 'Selamat Datang di Halaman Belajar!',
                    content: <TutorialContent />,
                    onClose: () => setHasSeenTutorial(true) // Mark as seen when closed
                });
            }, 1000); // Show tutorial after 1 second

            return () => clearTimeout(timer);
        }
    }, [hasSeenTutorial, setHasSeenTutorial, setSliderState]);

    return null; // This component does not render anything itself
};

export default Tutorial;
