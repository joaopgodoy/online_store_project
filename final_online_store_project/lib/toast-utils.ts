import { useToast } from '@/hooks/use-toast'

export type ToastVariant = "default" | "destructive"

// Common toast messages used across components
export const useCommonToasts = () => {
  const { toast } = useToast()

  return {
    loginRequired: () => toast({
      title: "Login necessário",
      description: "Faça login para adicionar produtos ao carrinho.",
      variant: "destructive"
    }),

    productAdded: (quantity: number, productName: string) => toast({
      title: "Produto adicionado ao carrinho",
      description: `${quantity}x ${productName} foi adicionado ao seu carrinho.`,
    }),

    stockInsufficient: (message?: string) => toast({
      title: "Estoque insuficiente",
      description: message || "Não há estoque suficiente para a quantidade solicitada",
      variant: "destructive",
    }),

    productUnavailable: (message?: string) => toast({
      title: "Produto indisponível",
      description: message || "Este produto não está disponível no momento.",
      variant: "destructive",
    }),

    addToCartError: (message?: string) => toast({
      title: "Erro ao adicionar produto",
      description: message || "Não foi possível adicionar o produto ao carrinho. Tente novamente.",
      variant: "destructive",
    }),

    maxQuantityReached: (maxQuantity: number) => toast({
      title: "Quantidade máxima atingida",
      description: `Você já selecionou a quantidade máxima disponível (${maxQuantity} ${maxQuantity === 1 ? 'unidade' : 'unidades'}).`,
      variant: "destructive"
    }),

    stockWarning: (availableStock: number) => toast({
      title: "Atenção",
      description: `Você está próximo do limite de estoque (${availableStock} ${availableStock === 1 ? 'unidade' : 'unidades'} disponíveis).`,
      variant: "default"
    })
  }
}
