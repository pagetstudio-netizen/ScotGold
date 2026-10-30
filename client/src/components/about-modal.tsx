import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { SCOTGOLD_LOGO } from "@/lib/john-deere-assets";

interface AboutModalProps {
  open: boolean;
  onClose: () => void;
}

export default function AboutModal({ open, onClose }: AboutModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-white border border-gray-200 flex items-center justify-center overflow-hidden">
              <img src={SCOTGOLD_LOGO} alt="Scotgold Resources Ltd." className="w-10 h-10 object-contain" />
            </div>
            À propos de Scotgold
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 text-sm text-muted-foreground">
          <p>
            Scotgold Resources Ltd. est une société d’exploration et d’exploitation aurifère basée en Écosse. Son projet phare, la mine d’or de Cononish, se situe près de Tyndrum, dans les Highlands écossais.
          </p>
          <p>
            Le projet Cononish a connu plusieurs phases de développement, de financement et d’études de faisabilité, avec l’objectif d’atteindre une production commerciale d’or et d’argent. Scotgold mène aussi des activités d’exploration pour identifier d’autres zones aurifères en Écosse.
          </p>
          <div className="bg-secondary rounded-lg p-4 space-y-2">
            <h4 className="font-medium text-foreground">Nos avantages :</h4>
            <ul className="space-y-1">
              <li>- Projet phare : mine d’or de Cononish</li>
              <li>- Exploration aurifère en Écosse</li>
              <li>- Gains des produits stables crédités chaque jour</li>
              <li>- Or et argent</li>
              <li>- Système de parrainage attractif</li>
              <li>- Support client disponible</li>
            </ul>
          </div>
          <p className="text-xs">
            Version 1.0.0 - Tous droits réservés
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
