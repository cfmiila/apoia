import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

export function CampanhaDialogForm({
  open,
  onOpenChange,
  initialData,
  onSave,
  idOng,
}) {
  const [form, setForm] = useState({
    nome: "",
    descricao: "",
    meta: "",
    imageUrl: "",
    dataInicio: new Date().toISOString().split("T")[0], // Data atual como padrão
    dataFim: "",
  });

  useEffect(() => {
    if (initialData) {
      // Formata as datas para o input type="date" (YYYY-MM-DD)
      const formattedData = {
        ...initialData,
        dataInicio: initialData.dataInicio
          ? new Date(initialData.dataInicio).toISOString().split("T")[0]
          : "",
        dataFim: initialData.dataFim
          ? new Date(initialData.dataFim).toISOString().split("T")[0]
          : "",
      };
      setForm(formattedData);
    } else {
      setForm({
        nome: "",
        descricao: "",
        meta: "",
        imageUrl: "",
        dataInicio: new Date().toISOString().split("T")[0], // Data atual como padrão
        dataFim: "",
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const idOng = Number(localStorage.getItem("idOng"));
    if (!idOng) {
      alert("Você precisa estar logado como ONG para criar campanhas");
      return;
    }

    // Formata os dados para enviar ao backend
    const data = {
      ...form,
      meta: Number(form.meta),
      dataInicio: form.dataInicio
        ? new Date(form.dataInicio).toISOString()
        : new Date().toISOString(),
      dataFim: form.dataFim ? new Date(form.dataFim).toISOString() : null,
      idOng,
    };

    onSave(data);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="z-50 max-w-md bg-white">
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Editar Campanha" : "Nova Campanha"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <label className="font-medium">Nome</label>
          <Input
            name="nome"
            placeholder="Nome"
            value={form.nome}
            onChange={handleChange}
            required
            autoFocus
          />

          <label className="font-medium">Descrição</label>
          <Textarea
            name="descricao"
            placeholder="Descrição"
            value={form.descricao}
            onChange={handleChange}
          />

          <label className="font-medium">Meta (R$)</label>
          <Input
            name="meta"
            type="number"
            placeholder="Valor da meta"
            value={form.meta}
            onChange={handleChange}
            required
            min="0"
            step="0.01"
          />

          <label className="font-medium">URL da Imagem</label>
          <Input
            name="imageUrl"
            placeholder="https://exemplo.com/imagem.jpg"
            value={form.imageUrl}
            onChange={handleChange}
          />

          <label className="font-medium">Data de Início</label>
          <Input
            name="dataInicio"
            type="date"
            value={form.dataInicio}
            onChange={handleChange}
            required
          />

          <label className="font-medium">Data de Término (opcional)</label>
          <Input
            name="dataFim"
            type="date"
            value={form.dataFim}
            onChange={handleChange}
            min={form.dataInicio} // Não permite data anterior à de início
          />

          <div className="flex justify-end gap-2 pt-4">
            <Button
              className="cursor-pointer"
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
            >
              Salvar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
