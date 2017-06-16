CREATE VIEW dbo.flight_operation_pilots_v
AS
SELECT        dbo.users_v.userFullName + N' (' + dbo.users_v.id_no + N') (' + dbo.users_v.rankDesc + N') (' + dbo.flight_operation_pilots.duty + N')' AS pilot_name_id, dbo.flight_operation_pilots.flight_operation_id
FROM            dbo.flight_operation_pilots INNER JOIN
                         dbo.users_v ON dbo.flight_operation_pilots.pilot_id = dbo.users_v.user_id
