-- KPOP Global Platform - Initial Schema
-- Created: 2026-05-13

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- ARTISTS TABLE
-- ============================================
CREATE TABLE artists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Names (multi-language)
  name_ko VARCHAR(100),
  name_zh VARCHAR(100),
  name_en VARCHAR(100),
  
  -- Basic info
  group_name VARCHAR(100),
  agency VARCHAR(100),
  country VARCHAR(50),
  debut_date DATE,
  
  -- Images
  profile_image TEXT,
  banner_image TEXT,
  
  -- Social links
  social_links JSONB DEFAULT '{}',
  
  -- Attributes
  artist_type VARCHAR(20) DEFAULT 'group',
  member_count INT,
  tags TEXT[],
  
  -- Status
  status VARCHAR(20) DEFAULT 'active',
  hot_score INT DEFAULT 0,
  
  -- SEO
  slug VARCHAR(100) UNIQUE,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_artists_slug ON artists(slug);
CREATE INDEX idx_artists_hot ON artists(hot_score DESC);
CREATE INDEX idx_artists_agency ON artists(agency);
CREATE INDEX idx_artists_status ON artists(status);

-- ============================================
-- EVENTS TABLE
-- ============================================
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Basic info
  title VARCHAR(200),
  subtitle VARCHAR(200),
  artist_id UUID REFERENCES artists(id) ON DELETE SET NULL,
  
  -- Event type
  event_type VARCHAR(30),
  
  -- Location
  country VARCHAR(50),
  city VARCHAR(100),
  venue VARCHAR(200),
  address TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  
  -- Time
  event_date TIMESTAMPTZ,
  event_end_date TIMESTAMPTZ,
  door_time TIMESTAMPTZ,
  
  -- Ticketing
  ticket_open_date TIMESTAMPTZ,
  ticket_close_date TIMESTAMPTZ,
  price_range VARCHAR(100),
  currency VARCHAR(10) DEFAULT 'KRW',
  
  -- Links
  official_link TEXT,
  ticket_link TEXT,
  poster_image TEXT,
  
  -- Status
  status VARCHAR(20) DEFAULT 'upcoming',
  is_highlighted BOOLEAN DEFAULT FALSE,
  hot_score INT DEFAULT 0,
  
  -- Source
  source VARCHAR(50),
  source_id VARCHAR(100),
  
  -- SEO
  slug VARCHAR(100) UNIQUE,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_events_date ON events(event_date);
CREATE INDEX idx_events_country ON events(country);
CREATE INDEX idx_events_artist ON events(artist_id);
CREATE INDEX idx_events_type ON events(event_type);
CREATE INDEX idx_events_status ON events(status);
CREATE INDEX idx_events_hot ON events(hot_score DESC);

-- ============================================
-- NEWS TABLE
-- ============================================
CREATE TABLE news (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Title and content
  title VARCHAR(300),
  summary TEXT,
  content TEXT,
  
  -- Original
  original_title TEXT,
  original_content TEXT,
  language VARCHAR(10) DEFAULT 'ko',
  
  -- Source
  source VARCHAR(100),
  source_url TEXT,
  author VARCHAR(100),
  
  -- Relation
  artist_id UUID REFERENCES artists(id) ON DELETE SET NULL,
  
  -- Type
  news_type VARCHAR(30),
  tags TEXT[],
  
  -- Image
  image_url TEXT,
  images TEXT[],
  
  -- AI processing
  is_translated BOOLEAN DEFAULT FALSE,
  is_ai_summary BOOLEAN DEFAULT FALSE,
  
  -- Status
  status VARCHAR(20) DEFAULT 'pending',
  priority INT DEFAULT 5,
  hot_score INT DEFAULT 0,
  view_count INT DEFAULT 0,
  
  -- SEO
  slug VARCHAR(100) UNIQUE,
  
  -- Timestamps
  publish_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_news_publish ON news(publish_date DESC);
CREATE INDEX idx_news_artist ON news(artist_id);
CREATE INDEX idx_news_type ON news(news_type);
CREATE INDEX idx_news_hot ON news(hot_score DESC);
CREATE INDEX idx_news_status ON news(status);

-- ============================================
-- FLASH NEWS TABLE
-- ============================================
CREATE TABLE flash_news (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  content TEXT NOT NULL,
  news_type VARCHAR(30),
  priority INT DEFAULT 5,
  
  artist_id UUID REFERENCES artists(id) ON DELETE CASCADE,
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  source_news_id UUID REFERENCES news(id) ON DELETE SET NULL,
  
  is_active BOOLEAN DEFAULT TRUE,
  expires_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_flash_active ON flash_news(is_active, expires_at);

-- ============================================
-- USERS TABLE
-- ============================================
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  
  nickname VARCHAR(50),
  avatar_url TEXT,
  bio TEXT,
  
  language VARCHAR(10) DEFAULT 'zh',
  country_filter VARCHAR(50)[],
  
  following_count INT DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_login TIMESTAMPTZ
);

-- ============================================
-- FAVORITES TABLE
-- ============================================
CREATE TABLE favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  artist_id UUID REFERENCES artists(id) ON DELETE CASCADE,
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  
  notify_ticket BOOLEAN DEFAULT TRUE,
  notify_event BOOLEAN DEFAULT TRUE,
  notify_news BOOLEAN DEFAULT FALSE,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id, artist_id),
  UNIQUE(user_id, event_id),
  
  CHECK (
    (artist_id IS NOT NULL AND event_id IS NULL) OR
    (artist_id IS NULL AND event_id IS NOT NULL)
  )
);

CREATE INDEX idx_favorites_user ON favorites(user_id);

-- ============================================
-- AGENT LOGS TABLE
-- ============================================
CREATE TABLE agent_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  agent_name VARCHAR(50),
  task_type VARCHAR(30),
  
  status VARCHAR(20),
  
  input_data JSONB,
  output_data JSONB,
  error_message TEXT,
  
  items_processed INT DEFAULT 0,
  items_created INT DEFAULT 0,
  items_updated INT DEFAULT 0,
  
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  duration_ms INT,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_agent_logs_name ON agent_logs(agent_name);
CREATE INDEX idx_agent_logs_status ON agent_logs(status);
CREATE INDEX idx_agent_logs_created ON agent_logs(created_at DESC);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

-- Artists: public read
ALTER TABLE artists ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read artists" ON artists FOR SELECT USING (status = 'active');

-- Events: public read upcoming/ticketing
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read events" ON events FOR SELECT USING (status IN ('upcoming', 'ticketing', 'sold_out'));

-- News: public read published
ALTER TABLE news ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read news" ON news FOR SELECT USING (status = 'published');

-- Flash news: public read active
ALTER TABLE flash_news ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read flash_news" ON flash_news FOR SELECT USING (is_active = TRUE);

-- Users: users can read/update own profile
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own profile" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users update own profile" ON users FOR UPDATE USING (auth.uid() = id);

-- Favorites: users manage own
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own favorites" ON favorites FOR ALL USING (auth.uid() = user_id);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to all tables with updated_at
CREATE TRIGGER artists_updated_at BEFORE UPDATE ON artists
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER events_updated_at BEFORE UPDATE ON events
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER news_updated_at BEFORE UPDATE ON news
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Generate slug from name
CREATE OR REPLACE FUNCTION generate_slug(name VARCHAR)
RETURNS VARCHAR AS $$
BEGIN
  RETURN LOWER(REGEXP_REPLACE(name, '[^a-zA-Z0-9\u4e00-\u9fff]+', '-', 'g'));
END;
$$ LANGUAGE plpgsql;