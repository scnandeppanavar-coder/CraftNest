import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Bot, MessageCircleMore, SendHorizonal, X, Sparkles, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { productService } from '../services/productService';
import { categoryService } from '../services/categoryService';
import { orderService } from '../services/orderService';
import { chatService } from '../services/chatService';

const QUICK_PROMPTS = [
  'Shipping details',
  'Track my order',
  'Payment options',
  'Cancellation policy',
  'Product recommendations',
];

const createMessage = (role, text) => ({
  id: `${role}-${Date.now()}-${Math.random().toString(16).slice(2)}`,
  role,
  text,
});

const normalizeText = (value) => value.trim().toLowerCase();

const buildAssistantReply = ({ input, products, categories, userOrders, user }) => {
  const query = normalizeText(input);

  if (!query) {
    return 'Tell me what you need help with — shipping, payment, order tracking, cancellations, or handcrafted products.';
  }

  if (/hello|hi|hey|good (morning|afternoon|evening)/.test(query)) {
    return 'Hi! I can help with shipping, product questions, payment methods, cancellations, and order tracking for CraftNest.';
  }

  if (/(shipping|delivery|dispatch|arrives|arrive|shipment)/.test(query)) {
    return 'Most orders are packed and dispatched within 2–5 business days. Delivery timelines vary by location, and you can check the latest updates in your order details once the shipment is confirmed.';
  }

  if (/(payment|pay|card|upi|wallet|net banking|cod|cash on delivery)/.test(query)) {
    return 'Checkout supports the payment methods available on your order page. For the safest experience, we recommend using secure online payment options and confirming the order summary before placing it.';
  }

  if (/(cancel|cancellation|refund|return|exchange)/.test(query)) {
    return 'Cancellation is usually possible before the order is dispatched. Once the parcel has moved to the shipping stage, changes may be limited. If you need help, share your order number and we can guide you on the current status.';
  }

  if (/(track|tracking|status.*order|my order|latest order)/.test(query)) {
    if (!user?.userId) {
      return 'Please sign in to check your personal order history. Once you are logged in, I can help track your latest order and share the current status.';
    }

    if (userOrders.length === 0) {
      return 'I can only see your own order history, and there are no recent orders linked to your account right now. You can still review your purchases from the Orders page.';
    }

    const orderIdMatch = [...query.matchAll(/\b\d+\b/g)].map(Number).find((value) =>
      userOrders.some((order) => order.orderId === value)
    );

    if (orderIdMatch) {
      const targetOrder = userOrders.find((order) => order.orderId === orderIdMatch);
      return `Order #${targetOrder.orderId} is currently marked as ${targetOrder.status}. You can open the order details page for the most recent updates and delivery information.`;
    }

    const latestOrder = [...userOrders].sort((a, b) => b.orderId - a.orderId)[0];
    return `Your latest order is #${latestOrder.orderId}, and it is currently marked as ${latestOrder.status}. You can check the full details from your Orders section for the latest shipping updates.`;
  }

  const categoryMatch = categories.find((category) =>
    query.includes(category.categoryName?.toLowerCase())
  );

  if (categoryMatch) {
    const categoryProducts = products.filter((product) =>
      product.category?.categoryId === categoryMatch.categoryId
    );

    const sample = categoryProducts.slice(0, 2).map((product) => product.name).join(', ');
    return `${categoryMatch.categoryName} pieces include handcrafted selections like ${sample || 'our featured artisan items'}. You can browse the full collection from the category page.`;
  }

  const matchingProducts = products.filter((product) => {
    const name = product.name?.toLowerCase() || '';
    const normalizedQuery = query.replace(/watches/g, 'watch').replace(/clocks/g, 'clock').replace(/bags/g, 'bag');
    const normalizedName = name.replace(/watches/g, 'watch').replace(/clocks/g, 'clock').replace(/bags/g, 'bag');

    const isWatchQuery = normalizedQuery.includes('watch') && normalizedName.includes('watch');
    const isClockQuery = normalizedQuery.includes('clock') && normalizedName.includes('clock');

    return normalizedQuery.includes(normalizedName) || 
           normalizedName.includes(normalizedQuery) || 
           isWatchQuery ||
           isClockQuery ||
           normalizedQuery.includes(product.category?.categoryName?.toLowerCase?.() || '');
  });

  if (matchingProducts.length > 0) {
    const product = matchingProducts[0];
    return `I found ${product.name} in our collection. It is part of the ${product.category?.categoryName || 'artisan'} range and is available on our storefront. You can view the product details page for pricing, material details, and availability.`;
  }

  if (/(product|recommend|gift|popular|best seller|best-selling|special)/.test(query)) {
    const featured = products.slice(0, 3);
    const names = featured.map((product) => product.name).join(', ');
    return `Popular artisan picks right now include ${names}. If you are shopping for a gift, I can also suggest items by budget, style, or occasion.`;
  }

  if (/(category|categories|collection|shop)/.test(query)) {
    const names = categories.slice(0, 4).map((category) => category.categoryName).join(', ');
    return `Our handcrafted collections include ${names}. Each category highlights a different artisan style, from décor and accessories to everyday essentials.`;
  }

  return 'I can help with FAQs about shipping, product details, categories, payment options, order tracking, and cancellations. You can also ask me about a specific product or collection.';
};

const findProductsInText = (text, products) => {
  if (!text || !products || products.length === 0) return [];
  const normalizedText = text.toLowerCase();

  return products.filter((product) => {
    const productName = product.name?.toLowerCase();
    if (!productName || productName.length < 3) return false;
    return normalizedText.includes(productName);
  });
};

const ChatProductCard = ({ product }) => {
  const imageUrl = product.imageUrl || "https://via.placeholder.com/400x400?text=No+Image";

  return (
    <div className="flex gap-2.5 bg-white dark:bg-secondary-900 border border-secondary-200 dark:border-secondary-800 rounded-2xl p-2 shadow-sm transition hover:shadow-md mt-1 w-full text-left">
      <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 bg-secondary-50">
        <img
          src={imageUrl}
          alt={product.name}
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/400x400?text=No+Image";
          }}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div>
          <h4 className="text-[11px] font-bold text-secondary-900 dark:text-white truncate leading-tight">{product.name}</h4>
          <p className="text-[9px] text-secondary-500 dark:text-secondary-400 line-clamp-1 mt-0.5 leading-none">{product.description}</p>
        </div>

        <div className="flex items-center justify-between mt-1">
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-extrabold text-secondary-955 dark:text-white">₹{product.price}</span>
            {product.stock <= 0 ? (
              <span className="text-[8px] font-bold text-red-500 bg-red-50 dark:bg-red-950/30 px-1.5 py-0.5 rounded-full">Out of Stock</span>
            ) : (
              <span className="text-[8px] font-bold text-emerald-500 bg-emerald-50 dark:bg-emerald-950/30 px-1.5 py-0.5 rounded-full">{product.stock} left</span>
            )}
          </div>

          <Link
            to={`/products/${product.productId}`}
            className="text-[9px] font-bold text-white bg-primary-500 hover:bg-primary-600 px-2 py-0.5 rounded-lg transition"
          >
            View Product
          </Link>
        </div>
      </div>
    </div>
  );
};

const ChatbotWidget = () => {
  const { user, isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [userOrders, setUserOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([
    createMessage(
      'assistant',
      'Hi! I’m your CraftNest helper. Ask about products, shipping, payments, order tracking, or cancellations.'
    ),
  ]);
  const endRef = useRef(null);
  const chatbotRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (chatbotRef.current && !chatbotRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  useEffect(() => {
    const loadCatalog = async () => {
      try {
        const [productData, categoryData] = await Promise.all([
          productService.getAllProducts(),
          categoryService.getAllCategories(),
        ]);

        setProducts(productData || []);
        setCategories(categoryData || []);
      } catch (error) {
        console.error('Failed to load chatbot catalog data:', error);
      }
    };

    loadCatalog();
  }, []);

  useEffect(() => {
    const loadUserOrders = async () => {
      if (!isAuthenticated || !user?.userId) {
        setUserOrders([]);
        return;
      }

      try {
        const orders = await orderService.getOrders(user.userId);
        setUserOrders(Array.isArray(orders) ? orders : []);
      } catch (error) {
        console.error('Failed to load order data for chatbot:', error);
        setUserOrders([]);
      }
    };

    loadUserOrders();
  }, [isAuthenticated, user?.userId]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen, isLoading]);

  const sendMessage = async (rawInput) => {
    const trimmed = rawInput.trim();
    if (!trimmed) return;

    const userMessage = createMessage('user', trimmed);
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Map existing messages to ChatMessage history format (exclude initial greeting message)
      const history = messages.slice(1).map((msg) => ({
        role: msg.role,
        content: msg.text,
      }));

      const response = await chatService.sendMessage(trimmed, history);
      setMessages((prev) => [...prev, createMessage('assistant', response.reply)]);
    } catch (error) {
      console.error('Failed to get AI reply, falling back to rule-based reply:', error);
      
      const assistantReply = buildAssistantReply({
        input: trimmed,
        products,
        categories,
        userOrders,
        user,
      });

      setMessages((prev) => [...prev, createMessage('assistant', assistantReply)]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!isLoading) {
      sendMessage(input);
    }
  };

  return (
    <div ref={chatbotRef} className="fixed bottom-5 right-5 z-50">
      {isOpen && (
        <div className="mb-4 w-[min(92vw,380px)] overflow-hidden rounded-[28px] border border-secondary-200 bg-white shadow-[0_30px_80px_rgba(52,38,25,0.18)] dark:border-secondary-800 dark:bg-secondary-900">
          <div className="flex items-center justify-between border-b border-secondary-200 bg-gradient-to-r from-primary-500 to-primary-600 px-4 py-3 text-white dark:border-secondary-800">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-white/15">
                <Bot className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-bold">CraftNest Support</p>
                <p className="text-[10px] text-white/80">Online now</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="rounded-full p-2 text-white/90 transition hover:bg-white/10"
              aria-label="Close chat"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="flex max-h-[430px] min-h-[380px] flex-col bg-secondary-50 dark:bg-secondary-950">
            <div className="flex-1 space-y-3 overflow-y-auto p-4">
              {messages.map((message) => {
                const isAssistant = message.role === 'assistant';
                const matchedProducts = isAssistant ? findProductsInText(message.text, products) : [];

                return (
                  <div
                    key={message.id}
                    className={`flex flex-col ${message.role === 'user' ? 'items-end' : 'items-start'} space-y-1.5`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-6 shadow-sm ${
                        message.role === 'user'
                          ? 'bg-primary-500 text-white'
                          : 'border border-secondary-200 bg-white text-secondary-700 dark:border-secondary-800 dark:bg-secondary-900 dark:text-secondary-200'
                      }`}
                    >
                      {message.text}
                    </div>
                    {matchedProducts.length > 0 && (
                      <div className="w-[85%] space-y-1.5 flex flex-col items-stretch">
                        {matchedProducts.map((product) => (
                          <ChatProductCard key={product.productId} product={product} />
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-6 shadow-sm border border-secondary-200 bg-white text-secondary-500 dark:border-secondary-800 dark:bg-secondary-900 dark:text-secondary-400">
                    <div className="flex items-center gap-1.5 py-1">
                      <span className="h-2 w-2 animate-bounce rounded-full bg-secondary-400 [animation-delay:-0.3s]"></span>
                      <span className="h-2 w-2 animate-bounce rounded-full bg-secondary-400 [animation-delay:-0.15s]"></span>
                      <span className="h-2 w-2 animate-bounce rounded-full bg-secondary-400"></span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={endRef} />
            </div>

            <div className="border-t border-secondary-200 bg-white px-3 py-3 dark:border-secondary-800 dark:bg-secondary-900">
              <div className="mb-3 flex flex-wrap gap-2">
                {QUICK_PROMPTS.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => !isLoading && sendMessage(prompt)}
                    disabled={isLoading}
                    className="rounded-full border border-primary-200 bg-primary-50 px-2.5 py-1.5 text-[10px] font-semibold text-primary-700 transition hover:bg-primary-100 dark:border-primary-900/40 dark:bg-primary-950/60 dark:text-primary-300 disabled:opacity-50"
                  >
                    {prompt}
                  </button>
                ))}
              </div>

              <form onSubmit={handleSubmit} className="flex items-center gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  placeholder="Ask about products or order help..."
                  disabled={isLoading}
                  className="w-full rounded-full border border-secondary-200 bg-secondary-50 px-4 py-2.5 text-sm text-secondary-700 outline-none ring-0 placeholder:text-secondary-400 focus:border-primary-400 dark:border-secondary-700 dark:bg-secondary-800 dark:text-white dark:placeholder:text-secondary-500 disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-primary-500 text-white shadow-lg shadow-primary-500/20 transition hover:bg-primary-600 disabled:opacity-50"
                  aria-label="Send message"
                >
                  <SendHorizonal className="h-4 w-4" />
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className="group flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-[0_20px_45px_rgba(185,114,61,0.45)] transition hover:scale-105 hover:shadow-[0_25px_50px_rgba(185,114,61,0.55)]"
        aria-label="Open customer support chat"
      >
        <span className="absolute -top-2 -right-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-emerald-500 text-[9px] font-bold text-white">AI</span>
        <MessageCircleMore className="h-7 w-7" />
      </button>
    </div>
  );
};

export default ChatbotWidget;
