import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY

// Verificar se as variáveis de ambiente estão definidas
if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    "Erro: As variáveis de ambiente REACT_APP_SUPABASE_URL e REACT_APP_SUPABASE_ANON_KEY devem ser definidas",
  )
  console.error("URL atual:", supabaseUrl)
  console.error("Chave atual:", supabaseAnonKey ? "Definida (valor oculto)" : "Não definida")
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
})



// Debug para verificar se a conexão está funcionando
supabase.auth.getSession().then(({ data, error }) => {
  if (error) {
    console.error("Erro na conexão com Supabase:", error)
  } else {
    console.log("Conexão com Supabase estabelecida")
    console.log("URL do Supabase:", supabaseUrl)

    // Verificar buckets disponíveis
    supabase.storage.listBuckets().then(({ data: buckets, error: bucketsError }) => {
      if (bucketsError) {
        console.error("Erro ao listar buckets:", bucketsError)
      } else {
        console.log(
          "Buckets disponíveis:",
          buckets.map((b) => b.name),
        )
      }
    })
  }
})

