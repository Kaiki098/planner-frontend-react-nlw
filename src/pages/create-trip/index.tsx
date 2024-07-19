import { FormEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { InviteGuestsModal } from './invite-guests-modal';
import { ConfirmTripModal } from './confirm-trip-modal';
import { DestinationAndDateStep } from './steps/destinatio-and-date-step';
import { InviteGuestsStep } from './steps/invite-guests-step';
import { DateRange } from "react-day-picker";
import { api } from '../../lib/axios';

export function CreateTripPage() {
    const navigate = useNavigate();

    const [isGuestInputOpen, setIsGuestInputOpen] = useState(false);
    const [isGuestModalOpen, setIsGuestModalOpen] = useState(false);
    const [isConfirmTripModalOpen, setIsConfirmTripModalOpen] = useState(false);

    const [destination, setDestination] = useState("");
    const [ownerName, setOwnerName] = useState("");
    const [ownerEmail, setOwnerEmail] = useState("");
    const [eventStartAndEndDates, setEventStartAndEndDates] = useState<DateRange | undefined>()

    const [emailsToInvite, setEmailsToInvite] = useState(
        ['kaikialvarengasouza098@gmail.com']
    );

    function openGuestsInput() {
        setIsGuestInputOpen(true);
    }

    function closeGuestsInput() {
        setIsGuestInputOpen(false);
    }

    function openGuestsModal() {
        setIsGuestModalOpen(true);
    }

    function closeGuestsModal() {
        setIsGuestModalOpen(false);
    }

    function openConfirmTripModal() {
        setIsConfirmTripModalOpen(true);
    }

    function closeConfirmTripModal() {
        setIsConfirmTripModalOpen(false);
    }

    function addNewEmailToInvite(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const data = new FormData(event.currentTarget);
        const email = data.get('email')?.toString();

        if (!email || emailsToInvite.includes(email)) {
            return;
        }

        setEmailsToInvite([
            ...emailsToInvite,
            email
        ]);

        event.currentTarget.reset();
    }

    function removeEmailsFromInvites(emailToRemove: string) {
        const newEmailList = emailsToInvite.filter(email => email != emailToRemove);
        setEmailsToInvite(newEmailList);
    }

    async function createTrip(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (!destination) {
            console.log("no destination")
            return;
        }

        if (!eventStartAndEndDates?.from || !eventStartAndEndDates?.to) {
            console.log("no dates")
            return;
        }

        if (emailsToInvite.length == 0) {
            console.log("no email to invite")
            return;
        }

        if (!ownerEmail || !ownerName) {
            console.log("no email or name")
            return;
        }

        const response = await api.post("/trips", {
            destination: destination,
            starts_at: eventStartAndEndDates.from,
            ends_at: eventStartAndEndDates.to,
            emails_to_invite: emailsToInvite,
            owner_name: ownerName,
            owner_email: ownerEmail
        })

        const { tripId } = response.data

        console.log(eventStartAndEndDates)
        console.log(emailsToInvite)
        console.log(destination)
        console.log(ownerEmail)
        console.log(ownerName)
        navigate('/trips/' + tripId);
    }

    return (
        <div className="h-screen flex items-center justify-center bg-pattern bg-center bg-no-repeat">
            <div className="max-w-3xl w-full px-6 text-center space-y-10">
                <div className='flex flex-col items-center gap-3'>
                    <img src="/logo.svg" alt="plann.er" />
                    <p className="text-zinc-300 text-lg">Convide seus amigos e planeje sua próxima viagem!</p>
                </div>

                <div className='space-y-4'>

                    <DestinationAndDateStep
                        closeGuestsInput={closeGuestsInput}
                        isGuestInputOpen={isGuestInputOpen}
                        openGuestsInput={openGuestsInput}
                        setDestination={setDestination}
                        setEventStartAndEndDates={setEventStartAndEndDates}
                        eventStartAndEndDates={eventStartAndEndDates}
                    />

                    {isGuestInputOpen && (
                        <InviteGuestsStep
                            emailsToInvite={emailsToInvite}
                            openConfirmTripModal={openConfirmTripModal}
                            openGuestsModal={openGuestsModal}
                        />)
                    }
                </div>
                <p className="text-sm text-zinc-500">
                    Ao planejar sua viagem pela plann.er você automaticamente concorda <br />
                    com nossos <a className="text-zinc-300 underline" href="#">termos de uso</a> e <a className="text-zinc-300 underline" href="#">políticas de privacidade</a>.
                </p>
            </div>

            {isGuestModalOpen && (
                <InviteGuestsModal
                    addNewEmailToInvite={addNewEmailToInvite}
                    closeGuestsModal={closeGuestsModal}
                    emailsToInvite={emailsToInvite}
                    removeEmailsFromInvites={removeEmailsFromInvites}
                />
            )}

            {isConfirmTripModalOpen && (
                <ConfirmTripModal
                    closeConfirmTripModal={closeConfirmTripModal}
                    createTrip={createTrip}
                    setOwnerName={setOwnerName}
                    setOwnerEmail={setOwnerEmail}
                />
            )}

        </div >
    )
}
