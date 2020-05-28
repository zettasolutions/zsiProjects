CREATE VIEW dbo.places_v
AS
SELECT dbo.cities.*, dbo.states.state_name, dbo.states.state_code, dbo.countries.country_name, dbo.countries.country_code, dbo.countries.country_sname, dbo.countries.country_id
FROM     dbo.cities INNER JOIN
                  dbo.states ON dbo.cities.state_id = dbo.states.state_id INNER JOIN
                  dbo.countries ON dbo.states.country_id = dbo.countries.country_id
