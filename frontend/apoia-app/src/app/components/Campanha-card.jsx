"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Progress } from "@/components/ui/progress";

const formatCurrency = (value) => {
  const num = Number(value) || 0;
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(num);
};

export function CampanhaCard({
  campanha,
  onEdit,
  onDelete,
  ong,
  onDoarClick,
  isDoador = false,
}) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const valorArrecadado = Number(campanha.valorArrecadado || campanha.arrecadado || 0);
  const meta = Number(campanha.meta || 0);
  const progress = meta > 0 ? Math.min(100, (valorArrecadado / meta) * 100) : 0;

  return (
    <>
      {isDoador ? (
        // Layout para Doador
        <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
          <img
            src={campanha.imageUrl || campanha.imagem || "/default-campaign.jpg"}
            alt={campanha.nome || campanha.titulo || "Campanha"}
            className="w-full h-48 object-cover"
          />

          <div className="p-4">
            {ong && (
              <div className="flex items-center space-x-2 mb-2">
                <img
                  src={ong?.logo || "/default-ong.png"}
                  alt={ong?.nome}
                  className="h-6 w-6 rounded-full"
                />
                <span className="text-sm text-gray-600">{ong?.nome}</span>
              </div>
            )}

            <h3 className="font-bold text-lg mb-1">
              {campanha.nome || campanha.titulo}
            </h3>
            <p className="text-gray-600 text-sm mb-3 line-clamp-2">
              {campanha.descricao}
            </p>

            <div className="mb-3">
              <div className="flex justify-between text-sm mb-1">
                <span>Arrecadado: {formatCurrency(valorArrecadado)}</span>
                <span>Meta: {formatCurrency(meta)}</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            <Button  className="transition-all duration-200 ease-in-out hover:bg-blue-700 cursor-pointer border-1 border-gray-300 hover:border-gray-400 px-4 py-2 rounded-md text-white bg-blue-600" onClick={() => onDoarClick(campanha)}>
              Doar
            </Button>
          </div>
        </div>
      ) : (
        // Layout para ONG
        <Card className="rounded-2xl bg-white hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              {campanha.nome}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {(campanha.imageUrl || campanha.imagem) && (
              <img
                src={campanha.imageUrl || campanha.imagem}
                alt={`Imagem da campanha ${campanha.nome}`}
                className="w-full h-40 object-cover rounded-lg mb-3"
              />
            )}
            <p className="text-sm text-gray-600 line-clamp-3">
              {campanha.descricao}
            </p>
            <div className="grid grid-cols-2 gap-2 mt-3">
              <div>
                <p className="text-xs text-gray-500">Meta:</p>
                <p className="text-sm font-medium">{formatCurrency(meta)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Arrecadado:</p>
                <p className="text-sm font-medium">
                  {formatCurrency(valorArrecadado)}
                </p>
              </div>
            </div>

            <div className="flex gap-2 mt-4 pt-3 border-t">
              <Button
                variant="outline"
                className="transition-all duration-200 ease-in-out hover:bg-blue-200 cursor-pointer border-1 border-gray-300 hover:border-gray-400 px-4 py-2 rounded-md text-gray-700 bg-white"
                onClick={() => onEdit(campanha)}
              >
                Editar
              </Button>
              <Button
                variant="destructive"
                className="transition-all duration-200 ease-in-out hover:bg-red-700 cursor-pointer border-1 border-gray-300 hover:border-gray-400 px-4 py-2 rounded-md text-white bg-red-500"
                onClick={() => setShowDeleteDialog(true)}
              >
                Excluir
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir a campanha "{campanha.nome}"? Esta
              ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="transition-all duration-200 ease-in-out hover:bg-gray-100 cursor-pointer border-1 border-gray-300 hover:border-gray-400 px-4 py-2 rounded-md text-gray-700 bg-white">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              className="transition-all duration-200 ease-in-out hover:bg-red-700 cursor-pointer border-1 border-gray-300 hover:border-gray-400 px-4 py-2 rounded-md text-white bg-red-500"
              onClick={() => onDelete(campanha.id)}
            >
              Confirmar Exclusão
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}