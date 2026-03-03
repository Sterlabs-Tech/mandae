import '../styles/global.css';
import '../styles/animations.css';
import '../styles/components.css';
import { AppProvider } from '../store/AppContext';

export const metadata = {
    title: 'Mandaê - Logistics Dashboard',
    description: 'Logistics and delivery management application',
};

export default function RootLayout({ children }) {
    return (
        <html lang="pt-BR">
            <body>
                <AppProvider>
                    <div className="app-container">
                        {children}
                    </div>
                </AppProvider>
            </body>
        </html>
    );
}
