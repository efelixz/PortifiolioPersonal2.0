import { useSEO } from "@/hooks/SEOHelper";

export default function Studies() {
    useSEO({
        title: 'Estudos - Jefferson Felix',
        description: 'Cronograma de estudos e evolução técnica de Jefferson Felix. Acompanhe o desenvolvimento contínuo em React, TypeScript, Node.js e tecnologias modernas.',
        url: 'https://jeffersonfelix.dev/estudos',
        type: 'website',
        keywords: [
            'cronograma estudos',
            'desenvolvedor estudando',
            'aprendizado contínuo',
            'evolução técnica',
            'estudos programação',
            'tecnologias frontend'
        ]
    });

    const studySchedule = [
        {
            time: "07:00",
            monday: "JavaScript",
            tuesday: "",
            wednesday: "",
            thursday: "",
            friday: "",
            saturday: "",
            sunday: ""
        },
        {
            time: "07:30",
            monday: "",
            tuesday: "React.js",
            wednesday: "",
            thursday: "",
            friday: "",
            saturday: "",
            sunday: ""
        },
        {
            time: "10:00",
            monday: "",
            tuesday: "",
            wednesday: "Ciber Segurança",
            thursday: "Ciência de Dados",
            friday: "JavaScript",
            saturday: "Ciber Segurança",
            sunday: "Ciência de Dados"
        },
        {
            time: "11:40",
            monday: "",
            tuesday: "",
            wednesday: "Linux",
            thursday: "Python",
            friday: "Protheus",
            saturday: "Linux",
            sunday: "Python"
        },
        {
            time: "16:30",
            monday: "",
            tuesday: "",
            wednesday: "",
            thursday: "",
            friday: "Protheus",
            saturday: "",
            sunday: ""
        },
        {
            time: "17:00",
            monday: "",
            tuesday: "",
            wednesday: "",
            thursday: "",
            friday: "Automação Windows",
            saturday: "",
            sunday: ""
        },
        {
            time: "18:10",
            monday: "",
            tuesday: "",
            wednesday: "",
            thursday: "",
            friday: "Automação",
            saturday: "",
            sunday: ""
        },
        {
            time: "19:00",
            monday: "Polícia Militar",
            tuesday: "",
            wednesday: "",
            thursday: "",
            friday: "",
            saturday: "",
            sunday: ""
        },
        {
            time: "19:10",
            monday: "",
            tuesday: "React.js",
            wednesday: "React Native",
            thursday: "Automação",
            friday: "React Native",
            saturday: "",
            sunday: ""
        },
        {
            time: "20:20",
            monday: "",
            tuesday: "",
            wednesday: "",
            thursday: "",
            friday: "Curso AZ-900",
            saturday: "",
            sunday: ""
        },
        {
            time: "20:30",
            monday: "",
            tuesday: "",
            wednesday: "",
            thursday: "",
            friday: "Projeto",
            saturday: "",
            sunday: ""
        },
        {
            time: "20:50",
            monday: "",
            tuesday: "",
            wednesday: "Automação Windows",
            thursday: "N8N",
            friday: "Curso AZ-900",
            saturday: "N8N",
            sunday: ""
        },
        {
            time: "21:50",
            monday: "",
            tuesday: "",
            wednesday: "",
            thursday: "",
            friday: "Polícia Militar",
            saturday: "",
            sunday: ""
        },
        {
            time: "22:20",
            monday: "Polícia Militar",
            tuesday: "Polícia Militar",
            wednesday: "Polícia Militar",
            thursday: "Polícia Militar",
            friday: "Polícia Militar",
            saturday: "",
            sunday: ""
        }
    ];

    const days = [
        { key: "monday", label: "Segunda-feira" },
        { key: "tuesday", label: "Terça-feira" },
        { key: "wednesday", label: "Quarta-feira" },
        { key: "thursday", label: "Quinta-feira" },
        { key: "friday", label: "Sexta-feira" },
        { key: "saturday", label: "Sábado" },
        { key: "sunday", label: "Domingo" }
    ];

    const getSubjectColor = (subject: string) => {
        const colors: { [key: string]: string } = {
            "JavaScript": "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
            "React.js": "bg-blue-500/20 text-blue-300 border-blue-500/30",
            "React Native": "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
            "Ciber Segurança": "bg-red-500/20 text-red-300 border-red-500/30",
            "Ciência de Dados": "bg-purple-500/20 text-purple-300 border-purple-500/30",
            "Linux": "bg-green-500/20 text-green-300 border-green-500/30",
            "Python": "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
            "Protheus": "bg-orange-500/20 text-orange-300 border-orange-500/30",
            "Automação": "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
            "Automação Windows": "bg-indigo-600/20 text-indigo-300 border-indigo-600/30",
            "Polícia Militar": "bg-slate-500/20 text-slate-300 border-slate-500/30",
            "Curso AZ-900": "bg-pink-500/20 text-pink-300 border-pink-500/30",
            "N8N": "bg-violet-500/20 text-violet-300 border-violet-500/30",
            "Projeto": "bg-teal-500/20 text-teal-300 border-teal-500/30"
        };
        return colors[subject] || "bg-gray-500/20 text-gray-300 border-gray-500/30";
    };

    return (
        <div className="min-h-screen bg-slate-950 py-20">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h1 className="font-display text-4xl font-bold text-white md:text-5xl mb-4">
                        Cronograma de Estudos
                    </h1>
                    <p className="text-white/70 text-lg max-w-2xl mx-auto">
                        Minha rotina semanal de estudos e desenvolvimento profissional
                    </p>
                </div>

                <div className="bg-white/5 backdrop-blur rounded-2xl border border-white/10 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-white/10">
                                    <th className="text-left p-4 text-white font-semibold min-w-[80px]">Horário</th>
                                    {days.map((day) => (
                                        <th key={day.key} className="text-left p-4 text-white font-semibold min-w-[140px]">
                                            {day.label}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {studySchedule.map((slot, index) => (
                                    <tr key={index} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                        <td className="p-4 text-white/80 font-mono text-sm font-medium">
                                            {slot.time}
                                        </td>
                                        {days.map((day) => {
                                            const subject = slot[day.key as keyof typeof slot] as string;
                                            return (
                                                <td key={day.key} className="p-4">
                                                    {subject && (
                                                        <div className={`px-3 py-2 rounded-lg border text-xs font-medium text-center ${getSubjectColor(subject)}`}>
                                                            {subject}
                                                        </div>
                                                    )}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    <div className="bg-white/5 backdrop-blur rounded-xl border border-white/10 p-6">
                        <h3 className="text-white font-semibold text-lg mb-4">📊 Estatísticas</h3>
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-white/70">Total de horas/semana:</span>
                                <span className="text-white font-medium">~25h</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-white/70">Matérias ativas:</span>
                                <span className="text-white font-medium">12</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-white/70">Dias de estudo:</span>
                                <span className="text-white font-medium">7/7</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/5 backdrop-blur rounded-xl border border-white/10 p-6">
                        <h3 className="text-white font-semibold text-lg mb-4">🎯 Foco Principal</h3>
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                <span className="text-white/80 text-sm">JavaScript & React</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                <span className="text-white/80 text-sm">Ciber Segurança</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-slate-500"></div>
                                <span className="text-white/80 text-sm">Polícia Militar</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/5 backdrop-blur rounded-xl border border-white/10 p-6">
                        <h3 className="text-white font-semibold text-lg mb-4">⏰ Horários Principais</h3>
                        <div className="space-y-2 text-sm">
                            <div className="text-white/70">Manhã: <span className="text-white">07:00 - 11:40</span></div>
                            <div className="text-white/70">Tarde: <span className="text-white">16:30 - 18:10</span></div>
                            <div className="text-white/70">Noite: <span className="text-white">19:00 - 22:20</span></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}