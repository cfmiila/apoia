"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";

export function EventoDialogForm({
  open,
  onOpenChange,
  initialData,
  onSave,
  idOng,
}) {
  const [form, setForm] = useState({
    nome: "",
    descricao: "",
    data: "",
    horario: "", // ✅ Novo estado para o horário
    local: "",
    endereco: "",
    imagemUrl: "",
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        nome: initialData.nome || "",
        descricao: initialData.descricao || "",
        data: initialData.data ? initialData.data.split("T")[0] : "",
        horario: initialData.horario || "", // ✅ Carrega o horário existente
        local: initialData.local || "",
        endereco: initialData.endereco || "",
        imagemUrl: initialData.imagemUrl || "",
      });
    } else {
      setForm({
        nome: "",
        descricao: "",
        data: "",
        horario: "", // ✅ Limpa o horário para novo evento
        local: "",
        endereco: "",
        imagemUrl: "",
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSave({
      ...form,
      data: form.data ? new Date(form.data).toISOString() : null, // Mantenha a data como ISOString
      idOng,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-white">
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Editar Evento" : "Novo Evento"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            name="nome"
            placeholder="Nome do evento"
            value={form.nome}
            onChange={handleChange}
            required
          />
          <Textarea
            name="descricao"
            placeholder="Descrição"
            value={form.descricao}
            onChange={handleChange}
            required
          />
          <Input
            name="data"
            type="date"
            placeholder="Data"
            value={form.data}
            onChange={handleChange}
            required
          />
          {/* ✅ Novo input para o horário */}
          <Input
            name="horario"
            type="time" // Define o tipo para input de hora
            placeholder="Horário (HH:MM)"
            value={form.horario}
            onChange={handleChange}
            required // Torna o horário obrigatório
          />
          <Input
            name="local"
            placeholder="Local"
            value={form.local}
            onChange={handleChange}
            required
          />
          <Input
            name="endereco"
            placeholder="Endereço"
            value={form.endereco}
            onChange={handleChange}
            required
          />
          <Input
            name="imagemUrl"
            placeholder="URL da Imagem"
            value={form.imagemUrl}
            onChange={handleChange}
          />
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="transition-all duration-200 ease-in-out hover:bg-gray-100 cursor-pointer border-1 border-gray-300 hover:border-gray-400 px-4 py-2 rounded-md text-gray-700 bg-white"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="transition-all duration-200 ease-in-out hover:bg-blue-700 cursor-pointer border-1 border-gray-300 hover:border-gray-400 px-4 py-2 rounded-md text-white bg-blue-600"
            >
              {initialData ? "Atualizar" : "Criar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}