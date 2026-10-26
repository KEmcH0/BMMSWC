-- Initial content copied from the old hard-coded data. Run once after schema.sql.

insert into people (kind, name, position, bio, photo_url, sort_order) values
  ('committee', 'ASM Musfiqur Rahman', 'President', '', '/committee/images/pre.jpeg', 10),
  ('committee', 'Israt Akter', 'Vice President', '', '/committee/images/vp.jpeg', 20),
  ('committee', 'Toiyob Ali', 'General Secretary', '', '/committee/images/gs.jpeg', 30),
  ('committee', 'Merina Begum', 'Joint General Secretary', '', '/committee/images/merina.jpeg', 40),
  ('committee', 'Rafikul Islam', 'Treasurer', '', '/committee/images/tras.jpeg', 50),
  ('committee', 'Afikul Islam', 'Organizing Secretary', '', '/committee/images/orga.jpeg', 60),
  ('committee', 'Rafiqul Islam', 'Joint Organizing Secretary', '', '/committee/images/j_org.jpeg', 70),
  ('committee', 'Suhanur Rahman', 'Publicity Secretary', '', '/committee/images/public.jpeg', 80),
  ('committee', 'Nasrin Jahan', 'Joint Publicity Secretary', '', '/committee/images/joorag.jpeg', 90),
  ('committee', 'Faria Parvin Urmi', 'International Affairs Secretary', '', '/committee/images/inter.jpeg', 100),
  ('committee', 'Sumaiya Jannat', 'Literary and Cultural Secretary', '', '/committee/images/cul.jpeg', 110),
  ('committee', 'Nurul Uddin', 'Sport Secretary', '', '/committee/images/sport.jpeg', 120),
  ('committee', 'Mijanur Rahman', 'Office Secretary', '', '/committee/images/office.jpeg', 130),
  ('committee', 'Hamidur Rahman', 'Executive Member', '', '/committee/images/hamidur.jpeg', 140),
  ('committee', 'S M Rifakat Islam', 'Executive Member', '', '/committee/images/oyyko.jpeg', 150),
  ('committee', 'Tasnim Kamal Tanni', 'Executive Member', '', '/committee/images/tanni.jpeg', 160),
  ('committee', 'Tarana Munni', 'Executive Member', '', '/committee/images/tarana.jpeg', 170),
  ('committee', 'Maruf Sahab', 'Executive Member', '', '/committee/images/maruf.jpeg', 180),
  ('committee', 'Rubina Parvin', 'Executive Member', '', '/committee/images/rubina.jpeg', 190),
  ('committee', 'Tamanna Reza', 'Executive Member', '', '/committee/images/reza.jpeg', 200),
  ('committee', 'Md Kahar', 'Executive Member', '', '/committee/images/kahar.jpeg', 210),
  ('advisor', 'Md. Shahab Uddin', 'Advisor', 'Senior Teacher, Ali Amzad Government Girls High School.', '/advisors/images/shahabuddin.jpeg', 10),
  ('advisor', 'Kamal Uddin', 'Advisor', 'Senior Teacher, Tetaigoan Rashid Uddin High School.', '/advisors/images/kamal.jpeg', 20),
  ('advisor', 'Dr. Tarana Jebin', 'Advisor', 'Dental Surgeon, 32 BCS', '/advisors/images/tarana.jpeg', 30),
  ('advisor', 'Dr. Nazrul Islam', 'Advisor', 'Consultant (Medicine), MAG Osmani Medical College Hospital, Sylhet', '/advisors/images/nazrul.jpeg', 40),
  ('advisor', 'Rasel Ahmed', 'Advisor', '', '/advisors/images/rasel.jpeg', 50),
  ('advisor', 'Dr. Husne Ara Begum Sopna', 'Advisor', 'Registrar, 34 BCS', '/advisors/images/sopna.jpeg', 60),
  ('advisor', 'Jayed Hasan', 'Advisor', 'Assistant Superintendent of Police, 38 BCS', '/advisors/images/zayed.jpeg', 70),
  ('advisor', 'Tamizur Rahman', 'Advisor', 'Assistant Teacher, Tetaigoan Rashid Uddin High School.', '/advisors/images/tamizur.jpeg', 80),
  ('advisor', 'Sohel Reza', 'Advisor', 'Assistant Teacher, Tetaigoan Rashid Uddin High School.', '/advisors/images/sohel.jpeg', 90),
  ('advisor', 'Md. Sofiul Islam', 'Advisor', 'Honors 4th year, Mathematics', '/advisors/images/sofiul.jpeg', 100),
  ('advisor', 'Tajul Islam', 'Advisor', 'Master 1st year, Shahjalal University of Science and Technology, Sylhet', '/advisors/images/tajul.jpg', 110);

insert into news (slug, title, date, category, body, image_url) values
  ('merit-test-2025', 'BMMSWC Merit Test–2025', '2025-12-25', 'Education', 'Out of more than 200 exceptional students who participated in the BMMSWC Merit Test–2025, today we honor the best of the best. Congratulations to our meritorious achievers on this well-deserved success!', '/news/images/exam.jpg'),
  ('meritorious-student-reception-2025', 'Meritorious Student Reception', '2025-12-02', 'Education', 'Hard work, resilience, and pure dedication—all under one roof today! We are incredibly proud to host the Meritorious Student Reception and Prize Giving Ceremony to honor our top achievers.', '/news/images/songbordhona.jpg'),
  ('higher-studies-seminar-2025', 'Higher Studies Seminar 2025', '2025-10-03', 'Workshop', 'Charting the path to global success at the Higher Studies Seminar 2025! This event brings together ambitious minds to explore academic pathways, scholarship opportunities, and career-defining choices. Your journey to the world''s top universities begins right here!', '/news/images/seminar.jpeg');

insert into albums (slug, title, description) values
  ('bmmswc-moments', 'BMMSWC Moments', 'Photos from our programs and gatherings.');

insert into gallery (image_url) values
  ('/gallery/603891514_1307038501463533_8430517571634422696_n.jpg'),
  ('/gallery/603892548_1307038288130221_4193693146109389853_n.jpg'),
  ('/gallery/604707575_1307038321463551_5918743366700989239_n.jpg'),
  ('/gallery/604937279_1307038328130217_5464039469854960379_n.jpg'),
  ('/gallery/604943898_1307038231463560_4064660772291069443_n.jpg'),
  ('/gallery/605067364_1307038344796882_5183664339208549822_n.jpg'),
  ('/gallery/605121822_1307038544796862_1780611467672334153_n.jpg'),
  ('/gallery/605154484_1307038401463543_8027480029033443576_n.jpg'),
  ('/gallery/605250771_1307038531463530_8797305843740353187_n.jpg'),
  ('/gallery/605289988_1307038428130207_5326330781305732455_n.jpg'),
  ('/gallery/605543697_1307038278130222_5680330838436496100_n.jpg'),
  ('/gallery/605634563_1307038451463538_1179512482162470947_n.jpg'),
  ('/gallery/605634620_1307038354796881_7321560528529563128_n.jpg'),
  ('/gallery/606324332_1307038471463536_4295542107717079759_n.jpg'),
  ('/gallery/607183760_1307038361463547_3630832185239016193_n.jpg');
update gallery set album_id = (select id from albums where slug = 'bmmswc-moments') where album_id is null;
