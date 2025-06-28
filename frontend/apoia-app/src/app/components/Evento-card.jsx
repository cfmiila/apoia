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

export function EventoCard({
  evento,
  onEdit,
  onDelete,
  ong,
  isDoador = false,
}) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

  return (
    <>
      {isDoador ? (
        // Layout para DOADOR (sem botões Editar/Excluir)
        <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
          <img
            src={evento.imagemUrl || "/default-event.jpg"}
            alt={evento.nome}
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

            <h3 className="font-bold text-lg mb-1">{evento.nome}</h3>
            <p className="text-gray-600 text-sm mb-3 line-clamp-2">
              {evento.descricao}
            </p>

            <p className="text-sm mb-1">
              📅 {formatDate(evento.data)} | 📍 {evento.local}
            </p>
            <p className="text-sm text-gray-600">{evento.endereco}</p>
          </div>
        </div>
      ) : (
        // Layout para ONG (com botões Editar/Excluir somente se NÃO for doador)
        <Card className="rounded-2xl bg-white hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">{evento.nome}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {evento.imagemUrl && (
              <img
                src={evento.imagemUrl}
                alt={`${evento.nome}`}
                className="w-full h-40 object-cover rounded-lg mb-3"
              />
            )}
            <p className="text-sm text-gray-600 line-clamp-3">{evento.descricao}</p>
            <div className="grid grid-cols-2 gap-2 mt-3">
              <div>
                <p className="text-xs text-gray-500">Data:</p>
                <p className="text-sm font-medium">{formatDate(evento.data)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Local:</p>
                <p className="text-sm font-medium">{evento.local}</p>
              </div>
            </div>
            <p className="text-xs text-gray-500">Endereço:</p>
            <p className="text-sm mb-3">{evento.endereco}</p>

            {/* Botões só aparecem se NÃO for doador */}
            {!isDoador && (
              <div className="flex gap-2 mt-4 pt-3 border-t">
                <Button
                  variant="outline"
                  className="transition-all duration-200 ease-in-out hover:bg-blue-200 cursor-pointer border-1 border-gray-300 hover:border-gray-400 px-4 py-2 rounded-md text-gray-700 bg-white"
                  onClick={() => onEdit(evento)}
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
            )}
          </CardContent>
        </Card>
      )}

      {/* Dialog de Exclusão */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o evento "{evento.nome}"? Esta ação
              não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="transition-all duration-200 ease-in-out hover:bg-gray-100 cursor-pointer border-1 border-gray-300 hover:border-gray-400 px-4 py-2 rounded-md text-gray-700 bg-white">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              className="transition-all duration-200 ease-in-out hover:bg-red-700 cursor-pointer border-1 border-gray-300 hover:border-gray-400 px-4 py-2 rounded-md text-white bg-red-500"
              onClick={() => onDelete(evento.id)}
            >
              Confirmar Exclusão
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
