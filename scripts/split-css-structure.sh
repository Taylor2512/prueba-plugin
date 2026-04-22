#!/usr/bin/env bash
set -e

BASE_DIR=${1:-src/styles}

mkdir -p "$BASE_DIR/core"
mkdir -p "$BASE_DIR/app"
mkdir -p "$BASE_DIR/sisad-pdfme"

touch "$BASE_DIR/index.css"

touch "$BASE_DIR/core/tokens.css"
touch "$BASE_DIR/core/reset.css"
touch "$BASE_DIR/core/typography.css"
touch "$BASE_DIR/core/utilities.css"
touch "$BASE_DIR/core/animations.css"

touch "$BASE_DIR/app/shell.css"
touch "$BASE_DIR/app/nav.css"
touch "$BASE_DIR/app/cards.css"
touch "$BASE_DIR/app/buttons.css"
touch "$BASE_DIR/app/forms.css"

touch "$BASE_DIR/sisad-pdfme/foundation.css"
touch "$BASE_DIR/sisad-pdfme/control-bar.css"
touch "$BASE_DIR/sisad-pdfme/canvas.css"
touch "$BASE_DIR/sisad-pdfme/guides.css"
touch "$BASE_DIR/sisad-pdfme/moveable.css"
touch "$BASE_DIR/sisad-pdfme/snap.css"
touch "$BASE_DIR/sisad-pdfme/overlays.css"
touch "$BASE_DIR/sisad-pdfme/drag-overlay.css"
touch "$BASE_DIR/sisad-pdfme/left-sidebar.base.css"
touch "$BASE_DIR/sisad-pdfme/left-sidebar.groups.css"
touch "$BASE_DIR/sisad-pdfme/left-sidebar.plugins.css"
touch "$BASE_DIR/sisad-pdfme/right-sidebar.base.css"
touch "$BASE_DIR/sisad-pdfme/right-sidebar.layout.css"
touch "$BASE_DIR/sisad-pdfme/right-sidebar.views.css"
touch "$BASE_DIR/sisad-pdfme/detail-cards.css"
touch "$BASE_DIR/sisad-pdfme/docs-panel.css"
touch "$BASE_DIR/sisad-pdfme/dark-overrides.css"

cat > "$BASE_DIR/index.css" <<'EOF'
@import "./core/tokens.css";
@import "./core/reset.css";
@import "./core/typography.css";
@import "./core/animations.css";
@import "./core/utilities.css";

@import "./app/shell.css";
@import "./app/nav.css";
@import "./app/cards.css";
@import "./app/buttons.css";
@import "./app/forms.css";

@import "./sisad-pdfme/foundation.css";
@import "./sisad-pdfme/control-bar.css";
@import "./sisad-pdfme/canvas.css";
@import "./sisad-pdfme/guides.css";
@import "./sisad-pdfme/moveable.css";
@import "./sisad-pdfme/snap.css";
@import "./sisad-pdfme/overlays.css";
@import "./sisad-pdfme/drag-overlay.css";
@import "./sisad-pdfme/left-sidebar.base.css";
@import "./sisad-pdfme/left-sidebar.groups.css";
@import "./sisad-pdfme/left-sidebar.plugins.css";
@import "./sisad-pdfme/right-sidebar.base.css";
@import "./sisad-pdfme/right-sidebar.layout.css";
@import "./sisad-pdfme/right-sidebar.views.css";
@import "./sisad-pdfme/detail-cards.css";
@import "./sisad-pdfme/docs-panel.css";
@import "./sisad-pdfme/dark-overrides.css";
EOF

echo "Estructura CSS creada en $BASE_DIR"
