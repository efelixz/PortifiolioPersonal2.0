import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Edit, Trash2, Clock, Calendar } from 'lucide-react';

interface StudySlot {
  id: number;
  time: string;
  monday: string;
  tuesday: string;
  wednesday: string;
  thursday: string;
  friday: string;
  saturday: string;
  sunday: string;
}

interface StudyScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (schedule: StudySlot[]) => void;
  schedule: StudySlot[];
  loading?: boolean;
}

export default function StudyScheduleModal({
  isOpen,
  onClose,
  onSave,
  schedule,
  loading = false
}: StudyScheduleModalProps) {
  const [currentSchedule, setCurrentSchedule] = useState<StudySlot[]>(schedule);
  const [editingSlot, setEditingSlot] = useState<StudySlot | null>(null);
  const [newSlot, setNewSlot] = useState<Partial<StudySlot>>({
    time: '',
    monday: '',
    tuesday: '',
    wednesday: '',
    thursday: '',
    friday: '',
    saturday: '',
    sunday: ''
  });
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    setCurrentSchedule(schedule);
  }, [schedule]);

  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  const dayLabels = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];

  const handleAddSlot = () => {
    if (!newSlot.time) return;
    
    const id = Math.max(...currentSchedule.map(s => s.id), 0) + 1;
    const slot: StudySlot = {
      id,
      time: newSlot.time,
      monday: newSlot.monday || '',
      tuesday: newSlot.tuesday || '',
      wednesday: newSlot.wednesday || '',
      thursday: newSlot.thursday || '',
      friday: newSlot.friday || '',
      saturday: newSlot.saturday || '',
      sunday: newSlot.sunday || ''
    };

    const updatedSchedule = [...currentSchedule, slot].sort((a, b) => a.time.localeCompare(b.time));
    setCurrentSchedule(updatedSchedule);
    setNewSlot({ time: '', monday: '', tuesday: '', wednesday: '', thursday: '', friday: '', saturday: '', sunday: '' });
    setShowAddForm(false);
  };

  const handleEditSlot = (slot: StudySlot) => {
    setEditingSlot(slot);
  };

  const handleUpdateSlot = () => {
    if (!editingSlot) return;
    
    const updatedSchedule = currentSchedule.map(s => 
      s.id === editingSlot.id ? editingSlot : s
    );
    setCurrentSchedule(updatedSchedule);
    setEditingSlot(null);
  };

  const handleDeleteSlot = (id: number) => {
    const updatedSchedule = currentSchedule.filter(s => s.id !== id);
    setCurrentSchedule(updatedSchedule);
  };

  const handleSave = () => {
    onSave(currentSchedule);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-slate-800 rounded-lg shadow-xl w-full max-w-6xl mx-4 max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-700">
            <div className="flex items-center gap-3">
              <Calendar className="w-6 h-6 text-purple-400" />
              <h2 className="text-xl font-semibold text-white">Gerenciar Cronograma de Estudos</h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
            {/* Add new slot form */}
            {showAddForm && (
              <div className="mb-6 bg-slate-700 rounded-lg p-4 border border-slate-600">
                <h3 className="text-lg font-semibold mb-4 text-white">Adicionar Novo Horário</h3>
                <div className="grid grid-cols-1 md:grid-cols-8 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Horário</label>
                    <input
                      type="time"
                      value={newSlot.time}
                      onChange={(e) => setNewSlot({...newSlot, time: e.target.value})}
                      className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  {days.map((day, index) => (
                    <div key={day}>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        {dayLabels[index]}
                      </label>
                      <input
                        type="text"
                        value={newSlot[day as keyof StudySlot] as string || ''}
                        onChange={(e) => setNewSlot({...newSlot, [day]: e.target.value})}
                        placeholder="Matéria/Atividade"
                        className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                  ))}
                </div>
                <div className="flex gap-3 mt-4">
                  <button
                    onClick={handleAddSlot}
                    className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg text-white font-medium transition-colors"
                  >
                    Adicionar
                  </button>
                  <button
                    onClick={() => setShowAddForm(false)}
                    className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-lg text-white font-medium transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}

            {/* Add button */}
            {!showAddForm && (
              <div className="mb-6">
                <button
                  onClick={() => setShowAddForm(true)}
                  className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg text-white font-medium transition-colors"
                >
                  <Plus size={20} />
                  Adicionar Horário
                </button>
              </div>
            )}

            {/* Schedule table */}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-slate-600 rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-slate-700">
                    <th className="border border-slate-600 px-4 py-3 text-left text-white font-medium">
                      <Clock className="inline w-4 h-4 mr-2" />
                      Horário
                    </th>
                    {dayLabels.map((day) => (
                      <th key={day} className="border border-slate-600 px-4 py-3 text-left text-white font-medium">
                        {day}
                      </th>
                    ))}
                    <th className="border border-slate-600 px-4 py-3 text-center text-white font-medium">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentSchedule.map((slot) => (
                    <tr key={slot.id} className="hover:bg-slate-700/50">
                      <td className="border border-slate-600 px-4 py-3 text-white font-mono">
                        {editingSlot?.id === slot.id ? (
                          <input
                            type="time"
                            value={editingSlot.time}
                            onChange={(e) => setEditingSlot({...editingSlot, time: e.target.value})}
                            className="w-full px-2 py-1 bg-slate-600 border border-slate-500 rounded text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
                          />
                        ) : (
                          slot.time
                        )}
                      </td>
                      {days.map((day) => (
                        <td key={day} className="border border-slate-600 px-4 py-3">
                          {editingSlot?.id === slot.id ? (
                            <input
                              type="text"
                              value={editingSlot[day as keyof StudySlot] as string}
                              onChange={(e) => setEditingSlot({...editingSlot, [day]: e.target.value})}
                              className="w-full px-2 py-1 bg-slate-600 border border-slate-500 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-purple-500"
                              placeholder="Matéria/Atividade"
                            />
                          ) : (
                            <span className="text-white text-sm">
                              {slot[day as keyof StudySlot] as string || '-'}
                            </span>
                          )}
                        </td>
                      ))}
                      <td className="border border-slate-600 px-4 py-3">
                        <div className="flex items-center justify-center gap-2">
                          {editingSlot?.id === slot.id ? (
                            <>
                              <button
                                onClick={handleUpdateSlot}
                                className="text-green-400 hover:text-green-300 transition-colors"
                                title="Salvar alterações"
                              >
                                <Plus size={16} />
                              </button>
                              <button
                                onClick={() => setEditingSlot(null)}
                                className="text-gray-400 hover:text-gray-300 transition-colors"
                                title="Cancelar edição"
                              >
                                <X size={16} />
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => handleEditSlot(slot)}
                                className="text-blue-400 hover:text-blue-300 transition-colors"
                                title="Editar horário"
                              >
                                <Edit size={16} />
                              </button>
                              <button
                                onClick={() => handleDeleteSlot(slot.id)}
                                className="text-red-400 hover:text-red-300 transition-colors"
                                title="Excluir horário"
                              >
                                <Trash2 size={16} />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-700">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-slate-600 rounded-lg text-gray-400 hover:text-white hover:border-slate-500 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              disabled={loading}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 rounded-lg text-white font-medium transition-colors"
            >
              {loading ? 'Salvando...' : 'Salvar Cronograma'}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}