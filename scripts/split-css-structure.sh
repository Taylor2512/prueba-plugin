#!/usr/bin/env bash
set -e

BASE_DIR=${1:-src/styles}

mkdir -p "$BASE_DIR/core"
mkdir -p "$BASE_DIR/app"
mkdir -p "$BASE_DIR/pdfme"

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

touch "$BASE_DIR/pdfme/foundation.css"
touch "$BASE_DIR/pdfme/control-bar.css"
touch "$BASE_DIR/pdfme/canvas.css"
touch "$BASE_DIR/pdfme/guides.css"
touch "$BASE_DIR/pdfme/moveable.css"
touch "$BASE_DIR/pdfme/snap.css"
touch "$BASE_DIR/pdfme/overlays.css"
touch "$BASE_DIR/pdfme/drag-overlay.css"
touch "$BASE_DIR/pdfme/left-sidebar.base.css"
touch "$BASE_DIR/pdfme/left-sidebar.groups.css"
touch "$BASE_DIR/pdfme/left-sidebar.plugins.css"
touch "$BASE_DIR/pdfme/right-sidebar.base.css"
touch "$BASE_DIR/pdfme/right-sidebar.layout.css"
touch "$BASE_DIR/pdfme/right-sidebar.views.css"
touch "$BASE_DIR/pdfme/detail-cards.css"
touch "$BASE_DIR/pdfme/docs-panel.css"
touch "$BASE_DIR/pdfme/dark-overrides.css"

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

@import "./pdfme/foundation.css";
@import "./pdfme/control-bar.css";
@import "./pdfme/canvas.css";
@import "./pdfme/guides.css";
@import "./pdfme/moveable.css";
@import "./pdfme/snap.css";
@import "./pdfme/overlays.css";
@import "./pdfme/drag-overlay.css";
@import "./pdfme/left-sidebar.base.css";
@import "./pdfme/left-sidebar.groups.css";
@import "./pdfme/left-sidebar.plugins.css";
@import "./pdfme/right-sidebar.base.css";
@import "./pdfme/right-sidebar.layout.css";
@import "./pdfme/right-sidebar.views.css";
@import "./pdfme/detail-cards.css";
@import "./pdfme/docs-panel.css";
@import "./pdfme/dark-overrides.css";
EOF

echo "Estructura CSS creada en $BASE_DIR"
