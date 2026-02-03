import { useState, useEffect } from "react";
import { useAppDispatch } from "../../../store/hooks";
import { updateTask } from "../../../store/kanbanSlice";
import KanbanBoard from "../components/KanbanBoard";
import AddCardDialog from "../components/AddCardDialog";
import CardDetailDialog from "../components/CardDetailDialog";

type CardFormState = {
  title: string;
  description?: string;
  cardCode?: string;

  customerName?: string;
  value?: number;
  owner?: string;

  item?: string;
  quantity?: number;
  uom?: string;
  total?: number;
  pricePerUom?: number;
};

export default function KanbanPage() {
  const dispatch = useAppDispatch();

  const [addOpen, setAddOpen] = useState(false);
  const [activeColumnId, setActiveColumnId] = useState("");

  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [form, setForm] = useState<CardFormState>({
    title: "",
  });
  useEffect(() => {
    const nextTotal = (form.quantity ?? 0) * (form.pricePerUom ?? 0);

    if (form.total !== nextTotal) {
      setForm((prev: CardFormState) => ({
        ...prev,
        total: nextTotal,
      }));
    }
  }, [form.quantity, form.pricePerUom]);

  // const [form, setForm] = useState({
  //   title: "",
  //   description: "",
  //   value: "",
  //   owner: "",
  // });

  return (
    <>
      <KanbanBoard
        onAddCard={(colId) => {
          setActiveColumnId(colId);
          setAddOpen(true);
        }}
        onCardClick={(task) => {
          setSelectedTaskId(task.id);
          setForm({
            title: task.title || "",
            description: task.description || "",
            value: task.value?.toString() || "",
            owner: task.owner || "",
            cardCode: task.cardCode || "",
            customerName: task.customerName || "",
            item: task.item || "",
            quantity: task.quantity || 0,
            uom: task.uom || "",
            total: task.total || 0,
            pricePerUom: task.pricePerUom || 0,
          });
        }}
      />

      <AddCardDialog
        open={addOpen}
        columnId={activeColumnId}
        onClose={() => setAddOpen(false)}
      />

      <CardDetailDialog
        open={selectedTaskId !== null}
        form={form}
        setForm={setForm}
        onClose={() => setSelectedTaskId(null)}
        onSave={() => {
          if (!selectedTaskId) return;
          dispatch(
            updateTask({
              id: selectedTaskId,
              changes: {
                title: form.title,
                description: form.description,
                value: Number(form.value) || undefined,
                owner: form.owner,
                cardCode: form.cardCode || "",
                customerName: form.customerName || "",
                item: form.item || "",
                quantity: form.quantity || 0,
                uom: form.uom || "",
                total: form.total || 0,
                pricePerUom: form.pricePerUom || 0,
              },
            }),
          );
          setSelectedTaskId(null);
        }}
      />
    </>
  );
}
