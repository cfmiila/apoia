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

export function CampanhaCard({ campanha, onEdit, onDelete }) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  return (
    <>
      <Card className="rounded-2xl bg-white hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            {campanha.nome}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {campanha.imageUrl && (
            <img
              src={campanha.imageUrl}
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
              <p className="text-sm font-medium">
                {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                }).format(Number(campanha.meta))}
                </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Arrecadado:</p>
              <p className="text-sm font-medium">
                R$ {Number(campanha.arrecadado).toFixed(2)}
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
