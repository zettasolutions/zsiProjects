
CREATE PROCEDURE [dbo].[wing_commander_sel]
(
    
	@is_active varchar(1) = 'Y'
    
)
AS
BEGIN
   SELECT * FROM users_v WHERE ISNULL(wing_id,0) <> 0 and ISNULL(squadron_id,0) = 0 and is_active=@is_active
END;


