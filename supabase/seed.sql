SET session_replication_role = replica;

--
-- PostgreSQL database dump
--

-- \restrict QtbEIs4f31L94JrmhvzPDKOuvaWB5kTahYuwLyyeGxy3iJUowzmTMUVetc82pdD

-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.6

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: projects; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."projects" ("id", "slug", "name", "status", "is_public", "address_line1", "address_line2", "city", "state", "postal_code", "country", "estimated_completion", "actual_completion", "total_units", "short_description", "long_description", "hero_image_url", "featured", "sort_order", "metadata", "created_at", "updated_at") VALUES
	('ca8f4b24-593d-4f4b-8089-e8295ea84dc0', 'raintree', 'Raintree', 'completed', true, '4613 Raintree', NULL, 'Austin', 'TX', NULL, 'USA', '2025-04-01', '2025-04-01', 2, '2 Bedroom, 2.5 Bath, Pool', NULL, '4613-unit-1-main.webp', false, 1, '{"source_commit": "0bbadaa64cbe818d250f601d9e85cd7035e659de"}', '2026-01-18 13:21:35.319068+00', '2026-01-18 13:21:35.319068+00'),
	('c9456993-0780-4702-81df-20f5c02d20b6', 'capitol-lot-homes', 'Capitol Lot Homes', 'coming_soon', true, '1100 Congress Ave', NULL, 'Austin', 'TX', '78701', 'USA', '2027-06-01', NULL, 4, 'Purchased Capitol-area lot with plans for four modern homes.', 'This newly acquired lot near the Capitol is planned for a small collection of modern residences with private yards and rooftop views. Early design work is underway ahead of permitting and site prep.', NULL, false, 2, '{"source": "seed", "status_note": "lot_only"}', '2026-01-21 18:00:00+00', '2026-01-21 18:00:00+00'),
	('196b6c7a-bdfa-4428-87f7-caeea9f9373d', 'east-7th-residences', 'East 7th Residences', 'coming_soon', true, '1901 E 7th St', NULL, 'Austin', 'TX', '78702', 'USA', '2025-09-01', '2025-10-15', 2, 'Two completed homes in East Austin, ready for sale.', 'A pair of newly built, design-forward homes in East Austin. Construction is complete and both residences are now available, featuring open layouts, premium finishes, and private outdoor living.', NULL, false, 3, '{"source": "seed", "build_status": "complete", "sales_status": "not_sold"}', '2026-01-21 18:00:00+00', '2026-01-21 18:00:00+00');


--
--
-- Data for Name: units; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."units" ("id", "project_id", "name", "unit_code", "bedrooms", "bathrooms", "square_feet", "description", "floorplan_url", "availability_status", "sort_order", "metadata", "created_at", "updated_at") VALUES
	('96354bec-0f6a-4855-95a7-befe61c74935', 'ca8f4b24-593d-4f4b-8089-e8295ea84dc0', 'Unit 1', 'unit-1', 2.00, 2.50, NULL, '2 Bedroom, 2.5 Bath, Pool', NULL, 'sold', 0, '{}', '2025-12-22 20:21:23.843232+00', '2026-01-18 13:21:35.319068+00'),
	('73256e09-7e93-4535-be33-00c05489a846', 'ca8f4b24-593d-4f4b-8089-e8295ea84dc0', 'Unit 2', 'unit-2', 4.00, 3.00, NULL, '4 Bedroom + Office, 3 Bath, Pool', NULL, 'sold', 0, '{}', '2025-12-22 20:21:23.843232+00', '2026-01-18 13:21:35.319068+00'),
	('57c53f45-8165-4d99-a9a7-d7f79a20cd3c', '196b6c7a-bdfa-4428-87f7-caeea9f9373d', 'Unit A', 'unit-a', 3.00, 2.50, 2100, '3 Bed, 2.5 Bath with rooftop terrace. Listed at $1.2M.', NULL, 'available', 0, '{"list_price": 1200000}', '2026-01-21 18:00:00+00', '2026-01-21 18:00:00+00'),
	('996d9e47-fba2-46e2-8679-379dcfb5ee63', '196b6c7a-bdfa-4428-87f7-caeea9f9373d', 'Unit B', 'unit-b', 4.00, 3.50, 2600, '4 Bed, 3.5 Bath with attached garage. Listed at $1.45M.', NULL, 'available', 1, '{"list_price": 1450000}', '2026-01-21 18:00:00+00', '2026-01-21 18:00:00+00');


--
-- Data for Name: unit_photos; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."unit_photos" ("id", "unit_id", "storage_path", "alt_text", "caption", "sort_order", "metadata", "created_at") VALUES
	('f6864ef1-6ee8-433f-86ea-4ea0dc42ff06', '96354bec-0f6a-4855-95a7-befe61c74935', '4613-grp-a/02-DFD-2.jpg', '4613 Raintree Unit 1 - 02-DFD-2', NULL, 0, '{}', '2025-12-22 20:21:23.843232+00'),
	('11c6e9aa-b2cb-4068-a19a-84904c66f5be', '96354bec-0f6a-4855-95a7-befe61c74935', '4613-grp-a/03-DFD-3.jpg', '4613 Raintree Unit 1 - 03-DFD-3', NULL, 1, '{}', '2025-12-22 20:21:23.843232+00'),
	('b6ed2080-f493-442e-9a4c-1766fa640b41', '96354bec-0f6a-4855-95a7-befe61c74935', '4613-grp-a/04-DFD-4.jpg', '4613 Raintree Unit 1 - 04-DFD-4', NULL, 2, '{}', '2025-12-22 20:21:23.843232+00'),
	('ca214703-f108-47a9-bfef-362adaf765c7', '96354bec-0f6a-4855-95a7-befe61c74935', '4613-grp-a/05-DFD-5.jpg', '4613 Raintree Unit 1 - 05-DFD-5', NULL, 3, '{}', '2025-12-22 20:21:23.843232+00'),
	('0616bab5-2cbc-4f37-9eee-be42b7e889f1', '96354bec-0f6a-4855-95a7-befe61c74935', '4613-grp-a/06-DFD-6.jpg', '4613 Raintree Unit 1 - 06-DFD-6', NULL, 4, '{}', '2025-12-22 20:21:23.843232+00'),
	('d6db384d-f990-4c6a-9392-1d34f7a66f25', '96354bec-0f6a-4855-95a7-befe61c74935', '4613-grp-a/07-DFD-7.jpg', '4613 Raintree Unit 1 - 07-DFD-7', NULL, 5, '{}', '2025-12-22 20:21:23.843232+00'),
	('88e089c8-083e-4c40-b49a-7dba72d5099a', '96354bec-0f6a-4855-95a7-befe61c74935', '4613-grp-a/08-DFD-8.jpg', '4613 Raintree Unit 1 - 08-DFD-8', NULL, 6, '{}', '2025-12-22 20:21:23.843232+00'),
	('8e6ec097-8784-4d07-bb92-f8f8664cddea', '96354bec-0f6a-4855-95a7-befe61c74935', '4613-grp-a/09-DFD-9.jpg', '4613 Raintree Unit 1 - 09-DFD-9', NULL, 7, '{}', '2025-12-22 20:21:23.843232+00'),
	('39874734-e87f-4305-ab59-13b16fdc743f', '96354bec-0f6a-4855-95a7-befe61c74935', '4613-grp-a/10-DFD-10.jpg', '4613 Raintree Unit 1 - 10-DFD-10', NULL, 8, '{}', '2025-12-22 20:21:23.843232+00'),
	('a4d56a76-50f4-4850-b2d9-47ade187df40', '96354bec-0f6a-4855-95a7-befe61c74935', '4613-grp-a/12-DFD-12.jpg', '4613 Raintree Unit 1 - 12-DFD-12', NULL, 9, '{}', '2025-12-22 20:21:23.843232+00'),
	('7d249afa-0d55-4cb0-a782-3a012ba777c2', '96354bec-0f6a-4855-95a7-befe61c74935', '4613-grp-a/13-DFD-13.jpg', '4613 Raintree Unit 1 - 13-DFD-13', NULL, 10, '{}', '2025-12-22 20:21:23.843232+00'),
	('356d5773-35a3-4df7-842f-36a363c7a79f', '96354bec-0f6a-4855-95a7-befe61c74935', '4613-grp-a/14-DFD-14.jpg', '4613 Raintree Unit 1 - 14-DFD-14', NULL, 11, '{}', '2025-12-22 20:21:23.843232+00'),
	('9244eea9-bac8-4400-b469-cef6ceebb495', '96354bec-0f6a-4855-95a7-befe61c74935', '4613-grp-a/16-DFD-16.jpg', '4613 Raintree Unit 1 - 16-DFD-16', NULL, 12, '{}', '2025-12-22 20:21:23.843232+00'),
	('bb84197b-1497-4c88-8ce1-1ae4665be537', '96354bec-0f6a-4855-95a7-befe61c74935', '4613-grp-a/17-DFD-17.jpg', '4613 Raintree Unit 1 - 17-DFD-17', NULL, 13, '{}', '2025-12-22 20:21:23.843232+00'),
	('af5dc421-ee4d-40e1-aa96-c71ee3a48318', '96354bec-0f6a-4855-95a7-befe61c74935', '4613-grp-a/18-DFD-18.jpg', '4613 Raintree Unit 1 - 18-DFD-18', NULL, 14, '{}', '2025-12-22 20:21:23.843232+00'),
	('25426a46-8054-47d1-8ce0-1a8ff9af23fa', '96354bec-0f6a-4855-95a7-befe61c74935', '4613-grp-a/19-DFD-19.jpg', '4613 Raintree Unit 1 - 19-DFD-19', NULL, 15, '{}', '2025-12-22 20:21:23.843232+00'),
	('98afb34b-b6be-411a-8b41-b99e999c8fc4', '96354bec-0f6a-4855-95a7-befe61c74935', '4613-grp-a/20-DFD-20.jpg', '4613 Raintree Unit 1 - 20-DFD-20', NULL, 16, '{}', '2025-12-22 20:21:23.843232+00'),
	('e00f7d97-cc7c-492a-a512-3a3d3cad3bc0', '73256e09-7e93-4535-be33-00c05489a846', '4613-grp-b/03-DFD-2.jpg', '4613 Raintree Unit 2 - 03-DFD-2', NULL, 0, '{}', '2025-12-22 20:21:23.843232+00'),
	('6072386a-cca4-4498-81ba-90a7523e7fef', '73256e09-7e93-4535-be33-00c05489a846', '4613-grp-b/04-DFD-3.jpg', '4613 Raintree Unit 2 - 04-DFD-3', NULL, 1, '{}', '2025-12-22 20:21:23.843232+00'),
	('03332d99-510c-48ea-b893-65b643e7f373', '73256e09-7e93-4535-be33-00c05489a846', '4613-grp-b/05-DFD-4.jpg', '4613 Raintree Unit 2 - 05-DFD-4', NULL, 2, '{}', '2025-12-22 20:21:23.843232+00'),
	('efdff88a-c18b-4456-81a0-9bbdfdac8397', '73256e09-7e93-4535-be33-00c05489a846', '4613-grp-b/06-DFD-5.jpg', '4613 Raintree Unit 2 - 06-DFD-5', NULL, 3, '{}', '2025-12-22 20:21:23.843232+00'),
	('f4778f44-50ee-4d3f-8fae-fc71f3d0cc5d', '73256e09-7e93-4535-be33-00c05489a846', '4613-grp-b/07-DFD-6.jpg', '4613 Raintree Unit 2 - 07-DFD-6', NULL, 4, '{}', '2025-12-22 20:21:23.843232+00'),
	('3d48afe0-30b8-4e1a-8cb1-772b4f4d31dd', '73256e09-7e93-4535-be33-00c05489a846', '4613-grp-b/08-DFD-7.jpg', '4613 Raintree Unit 2 - 08-DFD-7', NULL, 5, '{}', '2025-12-22 20:21:23.843232+00'),
	('4d1c3d29-c76c-4baa-96e1-7eb563b6614a', '73256e09-7e93-4535-be33-00c05489a846', '4613-grp-b/09-DFD-8.jpg', '4613 Raintree Unit 2 - 09-DFD-8', NULL, 6, '{}', '2025-12-22 20:21:23.843232+00'),
	('806a1839-384d-45ba-a2cc-daf0f4d19618', '73256e09-7e93-4535-be33-00c05489a846', '4613-grp-b/10-DFD-9.jpg', '4613 Raintree Unit 2 - 10-DFD-9', NULL, 7, '{}', '2025-12-22 20:21:23.843232+00'),
	('52890e08-d88b-42ef-a4e9-6c140f412554', '73256e09-7e93-4535-be33-00c05489a846', '4613-grp-b/11-DFD-10.jpg', '4613 Raintree Unit 2 - 11-DFD-10', NULL, 8, '{}', '2025-12-22 20:21:23.843232+00'),
	('40e048b4-e3de-4ba4-aed5-07d274dcddf1', '73256e09-7e93-4535-be33-00c05489a846', '4613-grp-b/12-DFD-11.jpg', '4613 Raintree Unit 2 - 12-DFD-11', NULL, 9, '{}', '2025-12-22 20:21:23.843232+00'),
	('6eb87311-6d3c-48b4-8085-e32781258662', '73256e09-7e93-4535-be33-00c05489a846', '4613-grp-b/13-DFD-12.jpg', '4613 Raintree Unit 2 - 13-DFD-12', NULL, 10, '{}', '2025-12-22 20:21:23.843232+00'),
	('8c6dfa72-a1c4-4296-95d1-a23ae0b27113', '73256e09-7e93-4535-be33-00c05489a846', '4613-grp-b/14-DFD-13.jpg', '4613 Raintree Unit 2 - 14-DFD-13', NULL, 11, '{}', '2025-12-22 20:21:23.843232+00'),
	('f0553521-1e7d-4632-a6c3-dce0b57d7874', '73256e09-7e93-4535-be33-00c05489a846', '4613-grp-b/15-DFD-14.jpg', '4613 Raintree Unit 2 - 15-DFD-14', NULL, 12, '{}', '2025-12-22 20:21:23.843232+00'),
	('a285e603-06ab-4b1e-9046-b647bf8cc59f', '73256e09-7e93-4535-be33-00c05489a846', '4613-grp-b/16-DFD-15.jpg', '4613 Raintree Unit 2 - 16-DFD-15', NULL, 13, '{}', '2025-12-22 20:21:23.843232+00'),
	('89ce91d2-dd6d-4c6f-8ce2-cd645605a149', '73256e09-7e93-4535-be33-00c05489a846', '4613-grp-b/17-DFD-16.jpg', '4613 Raintree Unit 2 - 17-DFD-16', NULL, 14, '{}', '2025-12-22 20:21:23.843232+00'),
	('75c625cd-5893-49b0-8481-108dad3bf025', '73256e09-7e93-4535-be33-00c05489a846', '4613-grp-b/18-DFD-17.jpg', '4613 Raintree Unit 2 - 18-DFD-17', NULL, 15, '{}', '2025-12-22 20:21:23.843232+00'),
	('58d769d1-a10a-4c7c-96c6-601bd5c238a8', '73256e09-7e93-4535-be33-00c05489a846', '4613-grp-b/19-DFD-18.jpg', '4613 Raintree Unit 2 - 19-DFD-18', NULL, 16, '{}', '2025-12-22 20:21:23.843232+00'),
	('e58e80a7-806d-43d0-a707-74725f21fa5b', '73256e09-7e93-4535-be33-00c05489a846', '4613-grp-b/20-DFD-19.jpg', '4613 Raintree Unit 2 - 20-DFD-19', NULL, 17, '{}', '2025-12-22 20:21:23.843232+00'),
	('cf181b9b-6aed-4019-8674-7e26e5b045fe', '73256e09-7e93-4535-be33-00c05489a846', '4613-grp-b/21-DFD-20.jpg', '4613 Raintree Unit 2 - 21-DFD-20', NULL, 18, '{}', '2025-12-22 20:21:23.843232+00'),
	('4e190554-feb0-4fb3-9fbc-38800ac02111', '73256e09-7e93-4535-be33-00c05489a846', '4613-grp-b/22-DFD-21.jpg', '4613 Raintree Unit 2 - 22-DFD-21', NULL, 19, '{}', '2025-12-22 20:21:23.843232+00'),
	('cc052575-5c2d-4ef9-9732-d8424715a1eb', '73256e09-7e93-4535-be33-00c05489a846', '4613-grp-b/23-DFD-22.jpg', '4613 Raintree Unit 2 - 23-DFD-22', NULL, 20, '{}', '2025-12-22 20:21:23.843232+00'),
	('16c06a92-1d2f-41eb-b538-8058f0589351', '73256e09-7e93-4535-be33-00c05489a846', '4613-grp-b/24-DFD-36.jpg', '4613 Raintree Unit 2 - 24-DFD-36', NULL, 21, '{}', '2025-12-22 20:21:23.843232+00'),
	('7dadb83b-7837-42b8-ae51-5147eb2ad9ee', '73256e09-7e93-4535-be33-00c05489a846', '4613-grp-b/25-DFD-28.jpg', '4613 Raintree Unit 2 - 25-DFD-28', NULL, 22, '{}', '2025-12-22 20:21:23.843232+00'),
	('c20b686e-8b5e-4d05-94f1-34092ad050b8', '73256e09-7e93-4535-be33-00c05489a846', '4613-grp-b/26-DFD-23.jpg', '4613 Raintree Unit 2 - 26-DFD-23', NULL, 23, '{}', '2025-12-22 20:21:23.843232+00'),
	('aa6b21b5-4cc4-4f3e-bab0-18ca0eff9c36', '73256e09-7e93-4535-be33-00c05489a846', '4613-grp-b/27-DFD-24.jpg', '4613 Raintree Unit 2 - 27-DFD-24', NULL, 24, '{}', '2025-12-22 20:21:23.843232+00'),
	('72fa01b9-d9db-491e-b466-cefb96c54a2e', '73256e09-7e93-4535-be33-00c05489a846', '4613-grp-b/28-DFD-37.jpg', '4613 Raintree Unit 2 - 28-DFD-37', NULL, 25, '{}', '2025-12-22 20:21:23.843232+00'),
	('8d2ebc5f-0834-47cf-bde2-f4d4e1bcc2b1', '73256e09-7e93-4535-be33-00c05489a846', '4613-grp-b/29-DFD-25.jpg', '4613 Raintree Unit 2 - 29-DFD-25', NULL, 26, '{}', '2025-12-22 20:21:23.843232+00'),
	('4658901a-327a-44b6-aecb-a1251cad9404', '73256e09-7e93-4535-be33-00c05489a846', '4613-grp-b/30-DFD-26.jpg', '4613 Raintree Unit 2 - 30-DFD-26', NULL, 27, '{}', '2025-12-22 20:21:23.843232+00'),
	('1e152dda-1fb7-4406-b111-b37fffc5496a', '73256e09-7e93-4535-be33-00c05489a846', '4613-grp-b/31-DFD-27.jpg', '4613 Raintree Unit 2 - 31-DFD-27', NULL, 28, '{}', '2025-12-22 20:21:23.843232+00'),
	('0b513ac1-fe65-4d66-9d3d-57d8c07e7cba', '73256e09-7e93-4535-be33-00c05489a846', '4613-grp-b/32-DFD-29.jpg', '4613 Raintree Unit 2 - 32-DFD-29', NULL, 29, '{}', '2025-12-22 20:21:23.843232+00'),
	('5115e3e2-7042-4ef8-adf3-d8dcab7d3b23', '73256e09-7e93-4535-be33-00c05489a846', '4613-grp-b/33-DFD-30.jpg', '4613 Raintree Unit 2 - 33-DFD-30', NULL, 30, '{}', '2025-12-22 20:21:23.843232+00'),
	('56ba4c95-0993-44e2-a9fd-f3fefb156b2c', '73256e09-7e93-4535-be33-00c05489a846', '4613-grp-b/34-DFD-31.jpg', '4613 Raintree Unit 2 - 34-DFD-31', NULL, 31, '{}', '2025-12-22 20:21:23.843232+00'),
	('aba05aac-03f8-4c42-b9aa-41bd7702f78e', '73256e09-7e93-4535-be33-00c05489a846', '4613-grp-b/36-DFD-32.jpg', '4613 Raintree Unit 2 - 36-DFD-32', NULL, 32, '{}', '2025-12-22 20:21:23.843232+00'),
	('ccffcc29-6910-4bd7-8fda-8c4801c231a7', '73256e09-7e93-4535-be33-00c05489a846', '4613-grp-b/37-DFD-33.jpg', '4613 Raintree Unit 2 - 37-DFD-33', NULL, 33, '{}', '2025-12-22 20:21:23.843232+00'),
	('e98b7606-ed43-402e-859b-3e074eee2c96', '73256e09-7e93-4535-be33-00c05489a846', '4613-grp-b/38-DFD-34.jpg', '4613 Raintree Unit 2 - 38-DFD-34', NULL, 34, '{}', '2025-12-22 20:21:23.843232+00'),
	('7cb6940d-e62e-4dd1-9d27-f5a129f2539e', '73256e09-7e93-4535-be33-00c05489a846', '4613-grp-b/39-DFD-35.jpg', '4613 Raintree Unit 2 - 39-DFD-35', NULL, 35, '{}', '2025-12-22 20:21:23.843232+00');


--
-- PostgreSQL database dump complete
--

-- \unrestrict QtbEIs4f31L94JrmhvzPDKOuvaWB5kTahYuwLyyeGxy3iJUowzmTMUVetc82pdD

RESET ALL;
