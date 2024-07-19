import { CircleCheck, CircleDashed } from "lucide-react";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { api } from "../../lib/axios";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Activity {
    date: string
    activities: [{
        id: string
        title: string
        occurs_at: string
    }]
}

export function Activities() {
    const { tripId } = useParams();

    const [activities, setActivities] = useState<Activity[]>([])

    useEffect(() => {
        api.get(`/trips/${tripId}/activities/organized`).then(r =>
            setActivities(r.data)
        )
    }, [tripId])

    return (
        <div className="space-y-8">
            {
                activities.map(category => {
                    return (
                        <div className="space-y-2.5">
                            <div className="flex gap-2 items-baseline">
                                <span className="text-xl text-zinc-300 font-semibold">{format(category.date, 'd')}</span>
                                <span className="text-xs text-zinc-500">{format(category.date, 'EEEE', { locale: ptBR })}</span>
                            </div>
                            {category.activities.length > 0 ? (
                                category.activities.map(activity => {
                                    return (
                                        <div className="px-4 py-2.5 bg-zinc-900 shadow-shape rounded-xl flex items-center gap-3">
                                            <CircleCheck className="size-5 text-lime-300" />
                                            <span className="text-zinc-100">{activity.title}</span>
                                            <span className="text-zinc-400 text-sm ml-auto">{format(activity.occurs_at, 'HH:mm')}h</span>
                                        </div>
                                    )
                                })) : (
                                <p className="text-zinc-500 text-sm">Nenhuma atividade cadastrada nessa data</p>
                            )}
                        </div>
                    )
                })
            }
        </div>

    )
} 