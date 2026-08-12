from pathlib import Path

p = Path(r"D:\Arfa Voice Agent\Arfa-Developers-NextJs-main\app\services\[slug]\page.tsx")
text = p.read_text(encoding="utf-8")

if "SmartToy" not in text:
    text = text.replace(
        "Email as EmailMarketingIcon,\n} from '@mui/icons-material'",
        "Email as EmailMarketingIcon,\n  SmartToy as AiIcon,\n  Hub as AutomationIcon,\n} from '@mui/icons-material'",
    )

AI_BLOCK = """  {
    id: 'ai-ml-llm',
    icon: <AiIcon sx={{ fontSize: 60 }} />,
    title: 'AI / ML & LLM Apps',
    shortDescription:
      'OpenAI integrations, RAG chatbots, AI voice agents, and LLM-powered products wired into real business workflows.',
    fullDescription:
      'We build production AI systems — not demos. From grounded RAG assistants and sales voice agents to custom LLM workflows, we connect models to your data, CRM, and ops so AI actually drives revenue and saves time.',
    features: [
      'OpenAI / LLM app development with guardrails',
      'RAG chatbots grounded on your docs and product data',
      'AI voice agents for sales, support, and lead qualification',
      'Embeddings, vector search, and knowledge-base pipelines',
      'Prompt engineering, evaluation, and low-hallucination design',
      'Tool calling into your APIs and CRM',
      'WhatsApp & messaging AI with human handoff',
      'Secure deployment with secrets, rate limits, and monitoring',
    ],
    technologies: ['OpenAI', 'GPT-4o', 'LangChain', 'RAG', 'Pinecone', 'pgvector', 'Whisper', 'Next.js', 'Python'],
    useCases: [
      'AI sales & support voice agents',
      'Internal knowledge assistants',
      'Customer-facing chatbots',
      'Document Q&A helpers',
      'Lead qualification copilots',
      'Product recommendation agents',
    ],
  },
"""

AUTO_BLOCK = """  {
    id: 'business-automation',
    icon: <AutomationIcon sx={{ fontSize: 60 }} />,
    title: 'Business Automation',
    shortDescription:
      'WhatsApp, Meta CRM, workflow automation, and AI drafts that cut manual ops for sales and support teams.',
    fullDescription:
      'We automate messaging flows, CRM sync, lead routing, follow-ups, and AI-assisted replies so your team focuses on conversations that need a human.',
    features: [
      'WhatsApp Business & Meta messaging automation',
      'CRM sync, lead capture, and pipeline routing',
      'AI draft replies with clear human escalation',
      'n8n / Zapier / custom workflow orchestration',
      'Appointment booking and reminder automation',
      'Ops dashboards for automation health',
      'Multi-channel inbox handoff',
      'Error handling, retries, and audit logs',
    ],
    technologies: ['WhatsApp API', 'Meta CRM', 'n8n', 'Zapier', 'OpenAI', 'Node.js', 'Webhooks'],
    useCases: [
      'Sales follow-up automation',
      'Support ticket triage',
      'Lead qualification bots',
      'Appointment & reminder flows',
      'CRM enrichment pipelines',
      'Internal ops alerts',
    ],
  },
"""

if "id: 'ai-ml-llm'" not in text:
    needle = "const services = [\n  {\n    id: 'web-development',"
    if needle in text:
        text = text.replace(needle, "const services = [\n" + AI_BLOCK + "  {\n    id: 'web-development',")
        print("inserted ai")
    else:
        print("ai needle missing")

if "id: 'business-automation'" not in text:
    needle = "  {\n    id: 'mobile-app-development',"
    if needle in text:
        text = text.replace(needle, AUTO_BLOCK + "  {\n    id: 'mobile-app-development',")
        print("inserted automation")
    else:
        print("auto needle missing")

old_tech = "technologies: ['React', 'Next.js', 'Vue.js', 'Angular', 'TypeScript', 'Node.js', 'Express', 'MongoDB', 'PostgreSQL'],"
new_tech = "technologies: ['React', 'Next.js', 'TypeScript', 'Node.js', 'PostgreSQL', 'MongoDB', 'Prisma', 'Tailwind', 'Vercel', 'Supabase'],"
if old_tech in text:
    text = text.replace(old_tech, new_tech, 1)
    print("updated web tech")

p.write_text(text, encoding="utf-8")
print("done")
