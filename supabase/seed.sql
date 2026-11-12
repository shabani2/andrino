-- Existing editorial material, published in both languages.
-- Re-running this seed never overwrites later editorial changes.
begin;
insert into public.entries
    (kind, slug, category_code, tags, cover_path, gallery_paths, external_url, featured, sort_order)
    values ('writing_theme', 'african-narratives', 'African Narratives',
      array['Representation', 'Local perspectives']::text[], '/images/articles/writing-7.webp', array['/images/articles/writing-7.webp']::text[],
      null, true, 0)
    on conflict (kind, slug) do nothing;
insert into public.entry_translations
      (entry_id, locale, title, summary, body, category_label, project_status,
       cover_alt, seo_title, seo_description, state, published_at)
      select id, 'en', 'African Narratives and Representation', 'How Africa is represented in international media, who tells its stories, and how local perspectives can help create a more complete picture of the continent.',
             'How Africa is represented in international media, who tells its stories, and how local perspectives can help create a more complete picture of the continent.', 'African Narratives',
             null,
             'A documentary scene reflecting local perspectives in eastern Congo', 'African Narratives and Representation', 'How Africa is represented in international media, who tells its stories, and how local perspectives can help create a more complete picture of the continent.',
             'published', now()
      from public.entries where kind = 'writing_theme' and slug = 'african-narratives'
      on conflict (entry_id, locale) do nothing;
insert into public.entry_translations
      (entry_id, locale, title, summary, body, category_label, project_status,
       cover_alt, seo_title, seo_description, state, published_at)
      select id, 'fr', 'Récits africains et représentation', 'Comment l’Afrique est représentée dans les médias internationaux, qui raconte ses histoires et comment les regards locaux peuvent contribuer à une image plus complète du continent.',
             'Comment l’Afrique est représentée dans les médias internationaux, qui raconte ses histoires et comment les regards locaux peuvent contribuer à une image plus complète du continent.', 'Récits africains',
             null,
             'Une scène documentaire reflétant les regards locaux dans l’est du Congo', 'Récits africains et représentation', 'Comment l’Afrique est représentée dans les médias internationaux, qui raconte ses histoires et comment les regards locaux peuvent contribuer à une image plus complète du continent.',
             'published', now()
      from public.entries where kind = 'writing_theme' and slug = 'african-narratives'
      on conflict (entry_id, locale) do nothing;
insert into public.entries
    (kind, slug, category_code, tags, cover_path, gallery_paths, external_url, featured, sort_order)
    values ('writing_theme', 'goma-great-lakes', 'Goma & Great Lakes',
      array['Goma', 'Everyday life']::text[], '/images/articles/writing-2.webp', array['/images/articles/writing-2.webp']::text[],
      null, false, 1)
    on conflict (kind, slug) do nothing;
insert into public.entry_translations
      (entry_id, locale, title, summary, body, category_label, project_status,
       cover_alt, seo_title, seo_description, state, published_at)
      select id, 'en', 'Goma and the Great Lakes', 'Stories about people, businesses, creativity, culture and everyday life in eastern DRC and the wider Great Lakes region.',
             'Stories about people, businesses, creativity, culture and everyday life in eastern DRC and the wider Great Lakes region.', 'Goma & Great Lakes',
             null,
             'Everyday urban life in the Great Lakes region', 'Goma and the Great Lakes', 'Stories about people, businesses, creativity, culture and everyday life in eastern DRC and the wider Great Lakes region.',
             'published', now()
      from public.entries where kind = 'writing_theme' and slug = 'goma-great-lakes'
      on conflict (entry_id, locale) do nothing;
insert into public.entry_translations
      (entry_id, locale, title, summary, body, category_label, project_status,
       cover_alt, seo_title, seo_description, state, published_at)
      select id, 'fr', 'Goma et les Grands Lacs', 'Des récits sur les personnes, les entreprises, la créativité, la culture et le quotidien dans l’est de la RDC et la région des Grands Lacs.',
             'Des récits sur les personnes, les entreprises, la créativité, la culture et le quotidien dans l’est de la RDC et la région des Grands Lacs.', 'Goma et Grands Lacs',
             null,
             'La vie urbaine quotidienne dans la région des Grands Lacs', 'Goma et les Grands Lacs', 'Des récits sur les personnes, les entreprises, la créativité, la culture et le quotidien dans l’est de la RDC et la région des Grands Lacs.',
             'published', now()
      from public.entries where kind = 'writing_theme' and slug = 'goma-great-lakes'
      on conflict (entry_id, locale) do nothing;
insert into public.entries
    (kind, slug, category_code, tags, cover_path, gallery_paths, external_url, featured, sort_order)
    values ('writing_theme', 'media-communication', 'Media & Communication',
      array['Storytelling', 'Media']::text[], '/images/articles/writing-3.webp', array['/images/articles/writing-3.webp']::text[],
      null, false, 2)
    on conflict (kind, slug) do nothing;
insert into public.entry_translations
      (entry_id, locale, title, summary, body, category_label, project_status,
       cover_alt, seo_title, seo_description, state, published_at)
      select id, 'en', 'Media and Communication', 'Reflections on storytelling, digital communication, public-interest media, social media and the responsibilities that come with publishing.',
             'Reflections on storytelling, digital communication, public-interest media, social media and the responsibilities that come with publishing.', 'Media & Communication',
             null,
             'A journalist''s notebooks and tools for communicating stories', 'Media and Communication', 'Reflections on storytelling, digital communication, public-interest media, social media and the responsibilities that come with publishing.',
             'published', now()
      from public.entries where kind = 'writing_theme' and slug = 'media-communication'
      on conflict (entry_id, locale) do nothing;
insert into public.entry_translations
      (entry_id, locale, title, summary, body, category_label, project_status,
       cover_alt, seo_title, seo_description, state, published_at)
      select id, 'fr', 'Médias et communication', 'Des réflexions sur les récits, la communication numérique, les médias d’intérêt public, les réseaux sociaux et les responsabilités liées à la publication.',
             'Des réflexions sur les récits, la communication numérique, les médias d’intérêt public, les réseaux sociaux et les responsabilités liées à la publication.', 'Médias et communication',
             null,
             'Les carnets et les outils d’un journaliste pour raconter des histoires', 'Médias et communication', 'Des réflexions sur les récits, la communication numérique, les médias d’intérêt public, les réseaux sociaux et les responsabilités liées à la publication.',
             'published', now()
      from public.entries where kind = 'writing_theme' and slug = 'media-communication'
      on conflict (entry_id, locale) do nothing;
insert into public.entries
    (kind, slug, category_code, tags, cover_path, gallery_paths, external_url, featured, sort_order)
    values ('writing_theme', 'innovation-entrepreneurship', 'Innovation & Enterprise',
      array['Local solutions', 'Enterprise']::text[], '/images/articles/writing-4.webp', array['/images/articles/writing-4.webp']::text[],
      null, false, 3)
    on conflict (kind, slug) do nothing;
insert into public.entry_translations
      (entry_id, locale, title, summary, body, category_label, project_status,
       cover_alt, seo_title, seo_description, state, published_at)
      select id, 'en', 'Innovation and Entrepreneurship', 'Exploring local solutions, creative businesses, emerging technologies and the people turning ideas into practical opportunities.',
             'Exploring local solutions, creative businesses, emerging technologies and the people turning ideas into practical opportunities.', 'Innovation & Enterprise',
             null,
             'A creative entrepreneur exploring local technology and ideas', 'Innovation and Entrepreneurship', 'Exploring local solutions, creative businesses, emerging technologies and the people turning ideas into practical opportunities.',
             'published', now()
      from public.entries where kind = 'writing_theme' and slug = 'innovation-entrepreneurship'
      on conflict (entry_id, locale) do nothing;
insert into public.entry_translations
      (entry_id, locale, title, summary, body, category_label, project_status,
       cover_alt, seo_title, seo_description, state, published_at)
      select id, 'fr', 'Innovation et entrepreneuriat', 'Explorer les solutions locales, les entreprises créatives, les technologies émergentes et les personnes qui transforment des idées en possibilités concrètes.',
             'Explorer les solutions locales, les entreprises créatives, les technologies émergentes et les personnes qui transforment des idées en possibilités concrètes.', 'Innovation et entrepreneuriat',
             null,
             'Un entrepreneur créatif explore des technologies et des idées locales', 'Innovation et entrepreneuriat', 'Explorer les solutions locales, les entreprises créatives, les technologies émergentes et les personnes qui transforment des idées en possibilités concrètes.',
             'published', now()
      from public.entries where kind = 'writing_theme' and slug = 'innovation-entrepreneurship'
      on conflict (entry_id, locale) do nothing;
insert into public.entries
    (kind, slug, category_code, tags, cover_path, gallery_paths, external_url, featured, sort_order)
    values ('writing_theme', 'society-culture', 'Society & Culture',
      array['Culture', 'Community']::text[], '/images/articles/writing-5.webp', array['/images/articles/writing-5.webp']::text[],
      null, false, 4)
    on conflict (kind, slug) do nothing;
insert into public.entry_translations
      (entry_id, locale, title, summary, body, category_label, project_status,
       cover_alt, seo_title, seo_description, state, published_at)
      select id, 'en', 'Society, Culture and Community', 'Observations about the experiences, challenges, creativity and ambitions that shape the communities around us.',
             'Observations about the experiences, challenges, creativity and ambitions that shape the communities around us.', 'Society & Culture',
             null,
             'A gathering celebrating culture and community in eastern Congo', 'Society, Culture and Community', 'Observations about the experiences, challenges, creativity and ambitions that shape the communities around us.',
             'published', now()
      from public.entries where kind = 'writing_theme' and slug = 'society-culture'
      on conflict (entry_id, locale) do nothing;
insert into public.entry_translations
      (entry_id, locale, title, summary, body, category_label, project_status,
       cover_alt, seo_title, seo_description, state, published_at)
      select id, 'fr', 'Société, culture et communautés', 'Des observations sur les expériences, les défis, la créativité et les ambitions qui façonnent les communautés qui nous entourent.',
             'Des observations sur les expériences, les défis, la créativité et les ambitions qui façonnent les communautés qui nous entourent.', 'Société et culture',
             null,
             'Un rassemblement célébrant la culture et la communauté dans l’est du Congo', 'Société, culture et communautés', 'Des observations sur les expériences, les défis, la créativité et les ambitions qui façonnent les communautés qui nous entourent.',
             'published', now()
      from public.entries where kind = 'writing_theme' and slug = 'society-culture'
      on conflict (entry_id, locale) do nothing;
insert into public.entries
    (kind, slug, category_code, tags, cover_path, gallery_paths, external_url, featured, sort_order)
    values ('writing_theme', 'personal-reflections', 'Personal Reflections',
      array['Reflections', 'The writing life']::text[], '/images/articles/writing-6.webp', array['/images/articles/writing-6.webp']::text[],
      null, false, 5)
    on conflict (kind, slug) do nothing;
insert into public.entry_translations
      (entry_id, locale, title, summary, body, category_label, project_status,
       cover_alt, seo_title, seo_description, state, published_at)
      select id, 'en', 'Personal Reflections', 'Lessons from my professional journey, ideas I am still working through, experiences that have changed my perspective and questions for which I do not yet have all the answers.',
             'Lessons from my professional journey, ideas I am still working through, experiences that have changed my perspective and questions for which I do not yet have all the answers.', 'Personal Reflections',
             null,
             'A quiet reading and writing scene for personal reflection', 'Personal Reflections', 'Lessons from my professional journey, ideas I am still working through, experiences that have changed my perspective and questions for which I do not yet have all the answers.',
             'published', now()
      from public.entries where kind = 'writing_theme' and slug = 'personal-reflections'
      on conflict (entry_id, locale) do nothing;
insert into public.entry_translations
      (entry_id, locale, title, summary, body, category_label, project_status,
       cover_alt, seo_title, seo_description, state, published_at)
      select id, 'fr', 'Réflexions personnelles', 'Les enseignements de mon parcours professionnel, les idées que je continue d’explorer, les expériences qui ont changé mon regard et les questions auxquelles je n’ai pas encore toutes les réponses.',
             'Les enseignements de mon parcours professionnel, les idées que je continue d’explorer, les expériences qui ont changé mon regard et les questions auxquelles je n’ai pas encore toutes les réponses.', 'Réflexions personnelles',
             null,
             'Un moment de lecture et d’écriture propice à la réflexion personnelle', 'Réflexions personnelles', 'Les enseignements de mon parcours professionnel, les idées que je continue d’explorer, les expériences qui ont changé mon regard et les questions auxquelles je n’ai pas encore toutes les réponses.',
             'published', now()
      from public.entries where kind = 'writing_theme' and slug = 'personal-reflections'
      on conflict (entry_id, locale) do nothing;
insert into public.entries
    (kind, slug, category_code, tags, cover_path, gallery_paths, external_url, featured, sort_order)
    values ('project', 'naleta-story', null,
      array['Regional narratives', 'Independent media', 'Culture']::text[], '/images/projects/projects-1.webp', array['/images/projects/projects-1.webp']::text[],
      null, true, 0)
    on conflict (kind, slug) do nothing;
insert into public.entry_translations
      (entry_id, locale, title, summary, body, category_label, project_status,
       cover_alt, seo_title, seo_description, state, published_at)
      select id, 'en', 'Naleta Story', 'A media direction rooted in my interest in storytelling and the need for richer narratives about Goma and the Great Lakes region.',
             'Through Naleta Story, I want to explore people, ideas, businesses, culture and initiatives that reveal the many dimensions of life in our communities.

The ambition is to create space for stories that inform, challenge assumptions and help audiences discover perspectives they might otherwise miss.', null,
             'Concept & editorial development',
             'Writers and storytellers sharing ideas at a lakeside workspace', 'Naleta Story', 'A media direction rooted in my interest in storytelling and the need for richer narratives about Goma and the Great Lakes region.',
             'published', now()
      from public.entries where kind = 'project' and slug = 'naleta-story'
      on conflict (entry_id, locale) do nothing;
insert into public.entry_translations
      (entry_id, locale, title, summary, body, category_label, project_status,
       cover_alt, seo_title, seo_description, state, published_at)
      select id, 'fr', 'Naleta Story', 'Un projet de média né de mon intérêt pour les récits et du besoin de regards plus riches sur Goma et la région des Grands Lacs.',
             'Avec Naleta Story, je souhaite explorer les personnes, les idées, les entreprises, la culture et les initiatives qui révèlent les multiples dimensions de la vie dans nos communautés.

L’ambition est de créer un espace pour des histoires qui informent, questionnent les idées reçues et aident les publics à découvrir des regards qui pourraient leur échapper.', null,
             'Conception et développement éditorial',
             'Des auteurs et des conteurs échangent dans un espace de travail au bord du lac', 'Naleta Story', 'Un projet de média né de mon intérêt pour les récits et du besoin de regards plus riches sur Goma et la région des Grands Lacs.',
             'published', now()
      from public.entries where kind = 'project' and slug = 'naleta-story'
      on conflict (entry_id, locale) do nothing;
insert into public.entries
    (kind, slug, category_code, tags, cover_path, gallery_paths, external_url, featured, sort_order)
    values ('project', 'community-youth', null,
      array['Youth voices', 'Community', 'Collaboration']::text[], '/images/projects/projects-2.webp', array['/images/projects/projects-2.webp']::text[],
      null, false, 1)
    on conflict (kind, slug) do nothing;
insert into public.entry_translations
      (entry_id, locale, title, summary, body, category_label, project_status,
       cover_alt, seo_title, seo_description, state, published_at)
      select id, 'en', 'Community and Youth Initiatives', 'My experience includes engagement with youth-focused, community and civil-society initiatives. I am interested in the ways young people organise, create, communicate and develop solutions in their communities.',
             'This space will highlight selected initiatives, my contribution and the lessons learned through collaboration.

Each project will clearly identify my role, collaborators and contribution. Only approved and publicly shareable materials will be featured.', null,
             'Selected initiatives to be documented',
             'An intergenerational conversation by the shores of Lake Kivu', 'Community and Youth Initiatives', 'My experience includes engagement with youth-focused, community and civil-society initiatives. I am interested in the ways young people organise, create, communicate and develop solutions in their communities.',
             'published', now()
      from public.entries where kind = 'project' and slug = 'community-youth'
      on conflict (entry_id, locale) do nothing;
insert into public.entry_translations
      (entry_id, locale, title, summary, body, category_label, project_status,
       cover_alt, seo_title, seo_description, state, published_at)
      select id, 'fr', 'Initiatives communautaires et jeunesse', 'Mon expérience comprend la participation à des initiatives pour la jeunesse, les communautés et la société civile. Je m’intéresse à la manière dont les jeunes s’organisent, créent, communiquent et développent des solutions dans leurs communautés.',
             'Cet espace présentera des initiatives sélectionnées, ma contribution et les enseignements tirés des collaborations.

Chaque projet précisera mon rôle, les collaborateurs et ma contribution. Seuls des contenus approuvés et partageables publiquement seront présentés.', null,
             'Initiatives sélectionnées à documenter',
             'Une conversation entre générations au bord du lac Kivu', 'Initiatives communautaires et jeunesse', 'Mon expérience comprend la participation à des initiatives pour la jeunesse, les communautés et la société civile. Je m’intéresse à la manière dont les jeunes s’organisent, créent, communiquent et développent des solutions dans leurs communautés.',
             'published', now()
      from public.entries where kind = 'project' and slug = 'community-youth'
      on conflict (entry_id, locale) do nothing;
insert into public.entries
    (kind, slug, category_code, tags, cover_path, gallery_paths, external_url, featured, sort_order)
    values ('project', 'communication-social-impact', null,
      array['Humanitarian communication', 'Visibility', 'People']::text[], '/images/projects/projects-3.webp', array['/images/projects/projects-3.webp']::text[],
      null, false, 2)
    on conflict (kind, slug) do nothing;
insert into public.entry_translations
      (entry_id, locale, title, summary, body, category_label, project_status,
       cover_alt, seo_title, seo_description, state, published_at)
      select id, 'en', 'Communication for Social Impact', 'My professional experience in humanitarian and development communication has shown me the importance of connecting programme activities with the people and experiences behind them.',
             'Here, I will showcase selected public-facing communication work that illustrates how stories, digital content and visibility materials can help make complex projects more accessible.

Each project will clearly identify my role, collaborators and contribution. Only approved and publicly shareable materials will be featured.', null,
             'Public-facing work to be documented',
             'Printed community communication materials in French and Swahili', 'Communication for Social Impact', 'My professional experience in humanitarian and development communication has shown me the importance of connecting programme activities with the people and experiences behind them.',
             'published', now()
      from public.entries where kind = 'project' and slug = 'communication-social-impact'
      on conflict (entry_id, locale) do nothing;
insert into public.entry_translations
      (entry_id, locale, title, summary, body, category_label, project_status,
       cover_alt, seo_title, seo_description, state, published_at)
      select id, 'fr', 'Communication pour l’impact social', 'Mon expérience professionnelle en communication humanitaire et de développement m’a montré l’importance de relier les activités des programmes aux personnes et aux expériences qui les animent.',
             'Je présenterai ici une sélection de travaux de communication destinés au public, pour montrer comment les récits, les contenus numériques et les supports de visibilité peuvent rendre des projets complexes plus accessibles.

Chaque projet précisera mon rôle, les collaborateurs et ma contribution. Seuls des contenus approuvés et partageables publiquement seront présentés.', null,
             'Travaux publics à documenter',
             'Des supports de communication communautaire imprimés en français et en swahili', 'Communication pour l’impact social', 'Mon expérience professionnelle en communication humanitaire et de développement m’a montré l’importance de relier les activités des programmes aux personnes et aux expériences qui les animent.',
             'published', now()
      from public.entries where kind = 'project' and slug = 'communication-social-impact'
      on conflict (entry_id, locale) do nothing;
insert into public.entries
    (kind, slug, category_code, tags, cover_path, gallery_paths, external_url, featured, sort_order)
    values ('practice_area', 'strategic-communication', 'Strategic Communication',
      array['Communication plans', 'Audience mapping']::text[], '/images/portfolio/portfolio-1.webp', array['/images/portfolio/portfolio-1.webp']::text[],
      null, true, 0)
    on conflict (kind, slug) do nothing;
insert into public.entry_translations
      (entry_id, locale, title, summary, body, category_label, project_status,
       cover_alt, seo_title, seo_description, state, published_at)
      select id, 'en', 'Strategic Communication and Campaigns', 'Developing communication plans, editorial calendars, key messages and digital content to support organisational objectives and reach relevant audiences.',
             'Developing communication plans, editorial calendars, key messages and digital content to support organisational objectives and reach relevant audiences.', 'Strategic Communication',
             null,
             'A collaborative communication planning session around a table', 'Strategic Communication and Campaigns', 'Developing communication plans, editorial calendars, key messages and digital content to support organisational objectives and reach relevant audiences.',
             'published', now()
      from public.entries where kind = 'practice_area' and slug = 'strategic-communication'
      on conflict (entry_id, locale) do nothing;
insert into public.entry_translations
      (entry_id, locale, title, summary, body, category_label, project_status,
       cover_alt, seo_title, seo_description, state, published_at)
      select id, 'fr', 'Communication stratégique et campagnes', 'Élaborer des plans de communication, des calendriers éditoriaux, des messages clés et des contenus numériques pour soutenir les objectifs des organisations et toucher les publics concernés.',
             'Élaborer des plans de communication, des calendriers éditoriaux, des messages clés et des contenus numériques pour soutenir les objectifs des organisations et toucher les publics concernés.', 'Communication stratégique',
             null,
             'Une séance collective de planification de la communication autour d’une table', 'Communication stratégique et campagnes', 'Élaborer des plans de communication, des calendriers éditoriaux, des messages clés et des contenus numériques pour soutenir les objectifs des organisations et toucher les publics concernés.',
             'published', now()
      from public.entries where kind = 'practice_area' and slug = 'strategic-communication'
      on conflict (entry_id, locale) do nothing;
insert into public.entries
    (kind, slug, category_code, tags, cover_path, gallery_paths, external_url, featured, sort_order)
    values ('practice_area', 'humanitarian-storytelling', 'Humanitarian Storytelling',
      array['Human-interest stories', 'Documentary']::text[], '/images/portfolio/portfolio-2.webp', array['/images/portfolio/portfolio-2.webp']::text[],
      null, false, 1)
    on conflict (kind, slug) do nothing;
insert into public.entry_translations
      (entry_id, locale, title, summary, body, category_label, project_status,
       cover_alt, seo_title, seo_description, state, published_at)
      select id, 'en', 'Humanitarian and Development Storytelling', 'Documenting people''s experiences, community initiatives and project activities through human-interest stories, interviews, photography and multimedia content.',
             'Documenting people''s experiences, community initiatives and project activities through human-interest stories, interviews, photography and multimedia content.', 'Humanitarian Storytelling',
             null,
             'A documentary scene of everyday life and community exchange', 'Humanitarian and Development Storytelling', 'Documenting people''s experiences, community initiatives and project activities through human-interest stories, interviews, photography and multimedia content.',
             'published', now()
      from public.entries where kind = 'practice_area' and slug = 'humanitarian-storytelling'
      on conflict (entry_id, locale) do nothing;
insert into public.entry_translations
      (entry_id, locale, title, summary, body, category_label, project_status,
       cover_alt, seo_title, seo_description, state, published_at)
      select id, 'fr', 'Récits humanitaires et de développement', 'Documenter les expériences des personnes, les initiatives communautaires et les activités des projets à travers des récits humains, des entretiens, la photographie et des contenus multimédias.',
             'Documenter les expériences des personnes, les initiatives communautaires et les activités des projets à travers des récits humains, des entretiens, la photographie et des contenus multimédias.', 'Récits humanitaires',
             null,
             'Une scène documentaire de la vie quotidienne et des échanges dans la communauté', 'Récits humanitaires et de développement', 'Documenter les expériences des personnes, les initiatives communautaires et les activités des projets à travers des récits humains, des entretiens, la photographie et des contenus multimédias.',
             'published', now()
      from public.entries where kind = 'practice_area' and slug = 'humanitarian-storytelling'
      on conflict (entry_id, locale) do nothing;
insert into public.entries
    (kind, slug, category_code, tags, cover_path, gallery_paths, external_url, featured, sort_order)
    values ('practice_area', 'digital-content', 'Digital Media',
      array['Digital storytelling', 'Social content']::text[], '/images/portfolio/portfolio-3.webp', array['/images/portfolio/portfolio-3.webp']::text[],
      null, false, 2)
    on conflict (kind, slug) do nothing;
insert into public.entry_translations
      (entry_id, locale, title, summary, body, category_label, project_status,
       cover_alt, seo_title, seo_description, state, published_at)
      select id, 'en', 'Digital Content and Social Media', 'Creating content for digital platforms, including social media campaigns, captions, carousels, short-form scripts and audience-focused communication materials.',
             'Creating content for digital platforms, including social media campaigns, captions, carousels, short-form scripts and audience-focused communication materials.', 'Digital Media',
             null,
             'A creative workspace with digital content and production equipment', 'Digital Content and Social Media', 'Creating content for digital platforms, including social media campaigns, captions, carousels, short-form scripts and audience-focused communication materials.',
             'published', now()
      from public.entries where kind = 'practice_area' and slug = 'digital-content'
      on conflict (entry_id, locale) do nothing;
insert into public.entry_translations
      (entry_id, locale, title, summary, body, category_label, project_status,
       cover_alt, seo_title, seo_description, state, published_at)
      select id, 'fr', 'Contenus numériques et réseaux sociaux', 'Créer des contenus pour les plateformes numériques : campagnes sur les réseaux sociaux, légendes, carrousels, scripts courts et supports de communication adaptés aux publics.',
             'Créer des contenus pour les plateformes numériques : campagnes sur les réseaux sociaux, légendes, carrousels, scripts courts et supports de communication adaptés aux publics.', 'Médias numériques',
             null,
             'Un espace de création équipé pour la production de contenus numériques', 'Contenus numériques et réseaux sociaux', 'Créer des contenus pour les plateformes numériques : campagnes sur les réseaux sociaux, légendes, carrousels, scripts courts et supports de communication adaptés aux publics.',
             'published', now()
      from public.entries where kind = 'practice_area' and slug = 'digital-content'
      on conflict (entry_id, locale) do nothing;
insert into public.entries
    (kind, slug, category_code, tags, cover_path, gallery_paths, external_url, featured, sort_order)
    values ('practice_area', 'editorial-media', 'Editorial Work',
      array['Editorial ideas', 'African narratives']::text[], '/images/portfolio/portfolio-4.webp', array['/images/portfolio/portfolio-4.webp']::text[],
      null, false, 3)
    on conflict (kind, slug) do nothing;
insert into public.entry_translations
      (entry_id, locale, title, summary, body, category_label, project_status,
       cover_alt, seo_title, seo_description, state, published_at)
      select id, 'en', 'Editorial and Media Work', 'Developing story ideas, writing articles, exploring underreported perspectives and contributing to conversations about African narratives and representation.',
             'Developing story ideas, writing articles, exploring underreported perspectives and contributing to conversations about African narratives and representation.', 'Editorial Work',
             null,
             'An editorial publication and notebooks in a reading workspace', 'Editorial and Media Work', 'Developing story ideas, writing articles, exploring underreported perspectives and contributing to conversations about African narratives and representation.',
             'published', now()
      from public.entries where kind = 'practice_area' and slug = 'editorial-media'
      on conflict (entry_id, locale) do nothing;
insert into public.entry_translations
      (entry_id, locale, title, summary, body, category_label, project_status,
       cover_alt, seo_title, seo_description, state, published_at)
      select id, 'fr', 'Travail éditorial et médias', 'Développer des idées de sujets, écrire des articles, explorer des regards peu représentés et contribuer aux échanges sur les récits africains et leur représentation.',
             'Développer des idées de sujets, écrire des articles, explorer des regards peu représentés et contribuer aux échanges sur les récits africains et leur représentation.', 'Travail éditorial',
             null,
             'Une publication et des carnets dans un espace de lecture', 'Travail éditorial et médias', 'Développer des idées de sujets, écrire des articles, explorer des regards peu représentés et contribuer aux échanges sur les récits africains et leur représentation.',
             'published', now()
      from public.entries where kind = 'practice_area' and slug = 'editorial-media'
      on conflict (entry_id, locale) do nothing;
insert into public.entries
    (kind, slug, category_code, tags, cover_path, gallery_paths, external_url, featured, sort_order)
    values ('practice_area', 'multimedia-production', 'Multimedia',
      array['Photography', 'Video and audio']::text[], '/images/portfolio/portfolio-5.webp', array['/images/portfolio/portfolio-5.webp']::text[],
      null, false, 4)
    on conflict (kind, slug) do nothing;
insert into public.entry_translations
      (entry_id, locale, title, summary, body, category_label, project_status,
       cover_alt, seo_title, seo_description, state, published_at)
      select id, 'en', 'Multimedia and Creative Production', 'Exploring how photography, video, audio and digital formats can bring stories to life and help audiences connect with people and places.',
             'Exploring how photography, video, audio and digital formats can bring stories to life and help audiences connect with people and places.', 'Multimedia',
             null,
             'Documentary media production in the Great Lakes region', 'Multimedia and Creative Production', 'Exploring how photography, video, audio and digital formats can bring stories to life and help audiences connect with people and places.',
             'published', now()
      from public.entries where kind = 'practice_area' and slug = 'multimedia-production'
      on conflict (entry_id, locale) do nothing;
insert into public.entry_translations
      (entry_id, locale, title, summary, body, category_label, project_status,
       cover_alt, seo_title, seo_description, state, published_at)
      select id, 'fr', 'Multimédia et production créative', 'Explorer comment la photographie, la vidéo, l’audio et les formats numériques peuvent donner vie aux récits et rapprocher les publics des personnes et des lieux.',
             'Explorer comment la photographie, la vidéo, l’audio et les formats numériques peuvent donner vie aux récits et rapprocher les publics des personnes et des lieux.', 'Multimédia',
             null,
             'Production documentaire dans la région des Grands Lacs', 'Multimédia et production créative', 'Explorer comment la photographie, la vidéo, l’audio et les formats numériques peuvent donner vie aux récits et rapprocher les publics des personnes et des lieux.',
             'published', now()
      from public.entries where kind = 'practice_area' and slug = 'multimedia-production'
      on conflict (entry_id, locale) do nothing;
insert into public.entries
    (kind, slug, category_code, tags, cover_path, gallery_paths, external_url, featured, sort_order)
    values ('practice_area', 'community-initiatives', 'Community',
      array['Community voices', 'Collaboration']::text[], '/images/portfolio/portfolio-6.webp', array['/images/portfolio/portfolio-6.webp']::text[],
      null, false, 5)
    on conflict (kind, slug) do nothing;
insert into public.entry_translations
      (entry_id, locale, title, summary, body, category_label, project_status,
       cover_alt, seo_title, seo_description, state, published_at)
      select id, 'en', 'Community-focused Initiatives', 'Engaging with youth-focused, community and civil-society initiatives, and exploring the lessons learned through collaboration.',
             'Engaging with youth-focused, community and civil-society initiatives, and exploring the lessons learned through collaboration.', 'Community',
             null,
             'Young people working together at a community initiative', 'Community-focused Initiatives', 'Engaging with youth-focused, community and civil-society initiatives, and exploring the lessons learned through collaboration.',
             'published', now()
      from public.entries where kind = 'practice_area' and slug = 'community-initiatives'
      on conflict (entry_id, locale) do nothing;
insert into public.entry_translations
      (entry_id, locale, title, summary, body, category_label, project_status,
       cover_alt, seo_title, seo_description, state, published_at)
      select id, 'fr', 'Initiatives communautaires', 'Participer à des initiatives pour la jeunesse, les communautés et la société civile, et explorer les enseignements tirés de ces collaborations.',
             'Participer à des initiatives pour la jeunesse, les communautés et la société civile, et explorer les enseignements tirés de ces collaborations.', 'Communauté',
             null,
             'Des jeunes collaborent à une initiative communautaire', 'Initiatives communautaires', 'Participer à des initiatives pour la jeunesse, les communautés et la société civile, et explorer les enseignements tirés de ces collaborations.',
             'published', now()
      from public.entries where kind = 'practice_area' and slug = 'community-initiatives'
      on conflict (entry_id, locale) do nothing;
commit;
