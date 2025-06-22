cd ./pocketbase; ./pocketbase serve
cd ./app; npm run dev
npx pocketbase-typegen --db ../pocketbase/pb_data/data.db --out ./src/data/pocketbase-types.ts // TODO: --out ./src/types/pocketbase-types.ts

// TODO: 
Prevent full workout read on every navigation
DB normalization