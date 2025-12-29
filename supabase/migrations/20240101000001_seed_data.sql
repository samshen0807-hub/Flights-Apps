-- Seed Airports
INSERT INTO public.airports (code, name, city, country, timezone) VALUES
('PEK', 'Beijing Capital International Airport', 'Beijing', 'China', 'Asia/Shanghai'),
('PKX', 'Beijing Daxing International Airport', 'Beijing', 'China', 'Asia/Shanghai'),
('SHA', 'Shanghai Hongqiao International Airport', 'Shanghai', 'China', 'Asia/Shanghai'),
('PVG', 'Shanghai Pudong International Airport', 'Shanghai', 'China', 'Asia/Shanghai'),
('CAN', 'Guangzhou Baiyun International Airport', 'Guangzhou', 'China', 'Asia/Shanghai'),
('SZX', 'Shenzhen Baoan International Airport', 'Shenzhen', 'China', 'Asia/Shanghai'),
('CTU', 'Chengdu Shuangliu International Airport', 'Chengdu', 'China', 'Asia/Shanghai'),
('HGH', 'Hangzhou Xiaoshan International Airport', 'Hangzhou', 'China', 'Asia/Shanghai'),
('JFK', 'John F. Kennedy International Airport', 'New York', 'USA', 'America/New_York'),
('LHR', 'Heathrow Airport', 'London', 'UK', 'Europe/London'),
('HND', 'Haneda Airport', 'Tokyo', 'Japan', 'Asia/Tokyo'),
('SIN', 'Singapore Changi Airport', 'Singapore', 'Singapore', 'Asia/Singapore');

-- Seed Airlines
INSERT INTO public.airlines (code, name, logo_url) VALUES
('CA', 'Air China', 'https://upload.wikimedia.org/wikipedia/en/thumb/f/fa/Air_China_Logo.svg/1200px-Air_China_Logo.svg.png'),
('MU', 'China Eastern Airlines', 'https://upload.wikimedia.org/wikipedia/en/thumb/f/f6/China_Eastern_Airlines_logo.svg/1200px-China_Eastern_Airlines_logo.svg.png'),
('CZ', 'China Southern Airlines', 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/China_Southern_Airlines_Logo.svg/1200px-China_Southern_Airlines_Logo.svg.png'),
('HU', 'Hainan Airlines', 'https://upload.wikimedia.org/wikipedia/en/thumb/5/5b/Hainan_Airlines_Logo.svg/1200px-Hainan_Airlines_Logo.svg.png'),
('CX', 'Cathay Pacific', 'https://upload.wikimedia.org/wikipedia/en/thumb/1/17/Cathay_Pacific_logo.svg/1200px-Cathay_Pacific_logo.svg.png');

-- Seed Flights (Using CTE to get IDs)
DO $$
DECLARE
    pek_id UUID;
    sha_id UUID;
    can_id UUID;
    jfk_id UUID;
    lhr_id UUID;
    ca_id UUID;
    mu_id UUID;
    cz_id UUID;
BEGIN
    SELECT id INTO pek_id FROM public.airports WHERE code = 'PEK';
    SELECT id INTO sha_id FROM public.airports WHERE code = 'SHA';
    SELECT id INTO can_id FROM public.airports WHERE code = 'CAN';
    SELECT id INTO jfk_id FROM public.airports WHERE code = 'JFK';
    SELECT id INTO lhr_id FROM public.airports WHERE code = 'LHR';
    
    SELECT id INTO ca_id FROM public.airlines WHERE code = 'CA';
    SELECT id INTO mu_id FROM public.airlines WHERE code = 'MU';
    SELECT id INTO cz_id FROM public.airlines WHERE code = 'CZ';

    -- PEK -> SHA
    INSERT INTO public.flights (flight_number, airline_id, departure_airport_id, arrival_airport_id, departure_time, arrival_time, aircraft_type, base_price) VALUES
    ('CA1234', ca_id, pek_id, sha_id, NOW() + INTERVAL '1 day 08:00:00', NOW() + INTERVAL '1 day 10:30:00', 'Boeing 737-800', 680.00),
    ('MU5101', mu_id, pek_id, sha_id, NOW() + INTERVAL '1 day 09:00:00', NOW() + INTERVAL '1 day 11:30:00', 'Airbus A320', 650.00),
    ('CA1501', ca_id, pek_id, sha_id, NOW() + INTERVAL '2 day 08:00:00', NOW() + INTERVAL '2 day 10:30:00', 'Boeing 737-800', 680.00);

    -- SHA -> PEK
    INSERT INTO public.flights (flight_number, airline_id, departure_airport_id, arrival_airport_id, departure_time, arrival_time, aircraft_type, base_price) VALUES
    ('CA1235', ca_id, sha_id, pek_id, NOW() + INTERVAL '1 day 14:00:00', NOW() + INTERVAL '1 day 16:30:00', 'Boeing 737-800', 680.00),
    ('MU5102', mu_id, sha_id, pek_id, NOW() + INTERVAL '1 day 15:00:00', NOW() + INTERVAL '1 day 17:30:00', 'Airbus A320', 650.00);

    -- CAN -> PEK
    INSERT INTO public.flights (flight_number, airline_id, departure_airport_id, arrival_airport_id, departure_time, arrival_time, aircraft_type, base_price) VALUES
    ('CZ3099', cz_id, can_id, pek_id, NOW() + INTERVAL '3 day 09:00:00', NOW() + INTERVAL '3 day 12:00:00', 'Airbus A330', 1200.00);

    -- PEK -> JFK (International)
    INSERT INTO public.flights (flight_number, airline_id, departure_airport_id, arrival_airport_id, departure_time, arrival_time, aircraft_type, base_price) VALUES
    ('CA981', ca_id, pek_id, jfk_id, NOW() + INTERVAL '5 day 13:00:00', NOW() + INTERVAL '5 day' + INTERVAL '13 hours', 'Boeing 777-300ER', 8500.00);

END $$;
