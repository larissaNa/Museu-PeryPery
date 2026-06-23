import { supabase } from "@/infra/supabaseClient";

async function testSupabaseStorageConnection() {
  try {
    // Lista os buckets disponíveis
    const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();
    if (bucketError) {
      console.error("Erro ao listar buckets:", bucketError.message);
      return;
    }
    console.log("Buckets disponíveis:", buckets);

    // Lista arquivos no bucket 'museum-images' (raiz)
    const { data: files, error: listError } = await supabase.storage.from("museum-images").list("");
    if (listError) {
      console.error("Erro ao listar arquivos no bucket 'museum-images':", listError.message);
      return;
    }
    console.log("Arquivos no bucket 'museum-images':", files);
  } catch (err) {
    console.error("Erro inesperado ao testar conexão com o storage do Supabase:", err);
  }
}

// Executa o teste
// Para rodar: importe e chame testSupabaseStorageConnection() em algum ponto do app ou rode via Node (com ajustes de import)
export default testSupabaseStorageConnection;
