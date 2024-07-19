import { CircleDashed, CircleCheck, UserCog } from "lucide-react";
import { Button } from "../../components/button";
import { api } from "../../lib/axios";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

interface Participant {
    id: string
    name: string
    email: string
    isConfirmed: boolean
}

export function Guests() {
    const { tripId } = useParams();

    const [participants, setParticipants] = useState<Participant[]>([])

    useEffect(() => {
        api.get(`/trips/${tripId}/participants`).then(r =>
            setParticipants(r.data)
        )
    }, [tripId])

    return (
        <div>
            <div className="space-y-6">
                <h2 className="font-semibold text-xl">Links Importantes</h2>
                <div className="space-y-5">
                    {participants.map((participant, index) => {
                        return (
                            <div key={participant.id} className="flex items-center justify-between gap-4">
                                <div className="space-y-1.5">
                                    <span className="block font-medium text-zinc-100">{participant.name.length > 0 ? participant.name : `Convidado ${index+1}`}</span>
                                    <span className="block text-sm text-zinc-400 truncate">
                                        {participant.email}
                                    </span>
                                </div>
                                {participant.isConfirmed ? (
                                    <CircleCheck className="size-5 text-lime-300 shrink-0" />
                                ) : (
                                    <CircleDashed className="size-5 text-zinc-400 shrink-0" />
                                )}
                            </div>
                        )
                    })}
                </div>
                <Button variant="secondary" size="full">
                    <UserCog className="size-5" />
                    Gerenciar Convidados
                </Button>
            </div>
        </div>
    )
}