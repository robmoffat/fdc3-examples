import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAgent, Contact as Fdc3Contact, Listener } from '@finos/fdc3';

// Removed CrmContactEntry and CrmData interfaces as CRM data is no longer fetched

const useFdc3ContactListener = () => {
    const navigate = useNavigate();

    useEffect(() => {
        let listener: Listener | null = null;

        const initializeFdc3 = async () => {
            try {
                const fdc3 = await getAgent();
                console.log("FDC3 Agent retrieved for contact listener.");

                listener = await fdc3.addContextListener('fdc3.contact', async (context) => {
                    const fdc3Contact = context as Fdc3Contact; // Use type assertion
                    console.log('FDC3 Contact context received in hook:', fdc3Contact);

                    const contactName = fdc3Contact.name

                    if (contactName) {
                        let chatId = contactName.toLowerCase().replace(/\s+/g, '_');
                        console.log(`Navigating to /chat/${chatId}`);
                        navigate(`/chat/${chatId}`);
                    }
                });

                console.log("FDC3 contact context listener added by hook.");

            } catch (error) {
                console.error('Error initializing FDC3 listener or FDC3 not available:', error);
            }
        };

        initializeFdc3();

        return () => {
            if (listener) {
                listener.unsubscribe();
                console.log('FDC3 contact context listener unsubscribed by hook.');
            }
        };
    }, [navigate]);
};

export default useFdc3ContactListener; 