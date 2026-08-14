# DigitalAgreements Recipient -> SISAD-PDFME User

DigitalAgreements conserva Recipient y business routing. El adapter público convierte sólo
lo necesario para interacción PDF: id/displayName/color/role/capabilities/hostReference.

No pasar Position, Request status, notification channels ni massive stage al reusable.
Designer puede mostrar/gestionar Users; la persistencia backend vuelve a traducir User
assignment a Recipient projection en el host.
