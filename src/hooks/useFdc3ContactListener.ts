import { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAgent, Contact as Fdc3Contact, Listener, IntentResolution } from '@finos/fdc3';

// Removed CrmContactEntry and CrmData interfaces as CRM data is no longer fetched

const useFdc3ContactListener = () => {
    const navigate = useNavigate();

    // Define openContactChat using useCallback to memoize it with navigate as a dependency
    const openContactChat = useCallback((contact: Fdc3Contact | null, source: string) => {
        if (!contact) {
            console.warn(`${source}: Received null contact, cannot open chat.`);
            return;
        }
        const contactName = contact.name;
        if (contactName) {
            const chatId = contactName.toLowerCase().replace(/\s+/g, '_');
            console.log(`${source}: Navigating to /chat/${chatId} for contact: ${contactName}`);
            navigate(`/chat/${chatId}`);
        } else {
            console.warn(`${source}: Contact context received without a name, cannot derive chatId.`);
        }
    }, [navigate]); // Dependency: navigate ensures this function is stable unless navigate changes

    useEffect(() => {
        let contactContextListener: Listener | null = null;
        let viewProfileIntentListener: Listener | null = null;

        const initializeFdc3 = async () => {
            try {
                const fdc3 = await getAgent();
                console.log("FDC3 Agent retrieved for listeners.");

                // Listener for fdc3.contact context
                contactContextListener = await fdc3.addContextListener('fdc3.contact', async (context) => {
                    console.log('FDC3 Contact context received in hook:', context);
                    openContactChat(context as Fdc3Contact, 'Context Listener (fdc3.contact)');
                });
                console.log("FDC3 contact context listener added by hook.");

                // Listener for ViewProfile intent
                viewProfileIntentListener = await fdc3.addIntentListener('ViewChat', async (context) => {
                    console.log('ViewProfile intent received in hook with context:', context);
                    openContactChat(context as Fdc3Contact, 'Intent Listener (ViewProfile)');
                    return;
                });
                console.log("FDC3 ViewProfile intent listener added by hook.");

            } catch (error) {
                console.error('Error initializing FDC3 listeners or FDC3 not available:', error);
            }
        };

        initializeFdc3();

        return () => {
            if (contactContextListener) {
                contactContextListener.unsubscribe();
                console.log('FDC3 contact context listener unsubscribed by hook.');
            }
            if (viewProfileIntentListener) {
                viewProfileIntentListener.unsubscribe();
                console.log('FDC3 ViewProfile intent listener unsubscribed by hook.');
            }
        };
        // openContactChat is stable due to useCallback, so it's a safe dependency
        // navigate is already included via openContactChat's dependencies
    }, [openContactChat]);

    return navigate; // Though the hook is primarily for side effects, returning navigate might be useful if needed
};

export default useFdc3ContactListener; 