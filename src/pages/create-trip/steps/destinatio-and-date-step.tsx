import { ArrowRight, Calendar, MapPin, Settings2, X } from "lucide-react";
import { Button } from "../../../components/button";
import { useState } from "react";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { DateRange, DayPicker } from "react-day-picker";

interface DestinationAndDateStepProps {
    isGuestInputOpen: boolean
    closeGuestsInput: () => void
    openGuestsInput: () => void
    setDestination: (destination: string) => void
    setEventStartAndEndDates: (dates: DateRange | undefined) => void
    eventStartAndEndDates: DateRange | undefined
}

export function DestinationAndDateStep({
    isGuestInputOpen,
    closeGuestsInput,
    openGuestsInput,
    setDestination,
    setEventStartAndEndDates,
    eventStartAndEndDates
}: DestinationAndDateStepProps) {
    const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
    const displayedDate = eventStartAndEndDates && eventStartAndEndDates.from && eventStartAndEndDates.to 
    ? format(eventStartAndEndDates.from, "d' de 'LLL", { locale: ptBR }).concat(' até ')
    .concat(format(eventStartAndEndDates.to, "d' de 'LLL", { locale: ptBR })) : null

    function openDatePicker() {
        setIsDatePickerOpen(true)
    }


    function closeDatePicker() {
        setIsDatePickerOpen(false)
    }

    return (
        <div className="h-16 bg-zinc-900 px-4 rounded-xl flex items-center shadow-shape gap-3">
            <div className="flex items-center gap-2 flex-1">
                <MapPin className="size-5 text-zinc-400" />
                <input onChange={event => setDestination(event.target.value)} disabled={isGuestInputOpen} type="text" placeholder="Para onde você vai?" className="bg-transparent text-lg placeholder-zinc-400 outline-none flex-1" />
            </div>

            <button disabled={isGuestInputOpen} onClick={openDatePicker} className="flex items-center gap-2 text-left w-[240px]">
                <Calendar className='size-5 text-zinc-400' />
                <span className="text-lg text-zinc-400 w-40 flex-1" >
                    {displayedDate || 'Quando?'}
                </span>
            </button>


            {isDatePickerOpen && (
                <div className='fixed inset-0 bg-black/60 flex items-center justify-center'>
                    <div className='rounded-xl py-5 px-6 shadow-shape bg-zinc-900 space-y-5'>

                        <div className='space-y-2'>
                            <div className='flex items-center justify-between'>
                                <h2 className='text-lg font-semibold'>Selecione a data</h2>
                                <button type='button' onClick={closeDatePicker}>
                                    <X className='size-5 text-zinc-400' />
                                </button>
                            </div>
                        </div>

                        <DayPicker mode="range" selected={eventStartAndEndDates} onSelect={setEventStartAndEndDates} />
                    </div>
                </div>)}



            <div className='w-px h-6 bg-zinc-800' />

            {isGuestInputOpen ? (
                <Button onClick={closeGuestsInput} variant="secondary">
                    Alterar local e data
                    <Settings2 className="size-5" />
                </Button>
            ) : (
                <Button onClick={openGuestsInput}>
                    Continuar
                    <ArrowRight className="size-5" />
                </Button>
            )}

        </div>

    )
}