
CREATE PROCEDURE [dbo].[positions_upd]
(
    @tt    positions_tt READONLY
   ,@user_id int
)
AS

BEGIN
-- Update Process
    UPDATE a 
        SET  position_code		= b.position_code
			,position			= b.position
			,is_active			= b.is_active
            ,updated_by			= @user_id
            ,updated_date		= GETDATE()
     FROM dbo.positions a INNER JOIN @tt b
        ON a.position_id = b.position_id
       WHERE (
				isnull(a.position_code,'')		<> isnull(b.position_code,'')   
			OR	isnull(a.position,'')			<> isnull(b.position,'')   
			OR	isnull(a.is_active,'')			<> isnull(b.is_active,'')  
	   )
	   
-- Insert Process
    INSERT INTO positions (
         position_code 
		,position
		,is_active
        ,created_by
        ,created_date
        )
    SELECT 
         position_code 
		,position
	   ,is_active
       ,@user_id
       ,GETDATE()
    FROM @tt
    WHERE position_id IS NULL 
	and position_code IS NOT NULL
	and position IS NOT NULL;
END






