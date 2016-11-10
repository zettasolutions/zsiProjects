

CREATE PROCEDURE [dbo].[wings_upd]
(
    @tt    wings_tt READONLY
   ,@user_id int
)
AS

BEGIN
-- Update Process
    UPDATE a 
        SET  wing_code			= b.wing_code
			,wing_name			= b.wing_name
			,wing_full_address  = b.wing_full_address
			,wing_commander_id	= b.wing_commander_id
			,is_active			= b.is_active
            ,updated_by			= @user_id
            ,updated_date		= GETDATE()
     FROM dbo.wings a INNER JOIN @tt b
        ON a.wing_id = b.wing_id
       WHERE (
				isnull(a.wing_code,'')			<> isnull(b.wing_code,'')   
			OR	isnull(a.wing_name,'')			<> isnull(b.wing_name,'')   
			OR	isnull(a.wing_full_address,'')	<> isnull(b.wing_full_address,'')   
			OR	isnull(a.wing_commander_id,0)	<> isnull(b.wing_commander_id,0)  
			OR	isnull(a.is_active,'')			<> isnull(b.is_active,'')  
	   )
	   
-- Insert Process
    INSERT INTO wings (
         wing_code 
		,wing_name
		,wing_full_address
		,wing_commander_id
		,is_active
        ,created_by
        ,created_date
        )
    SELECT 
        wing_code 
	   ,wing_name	
	   ,wing_full_address
	   ,wing_commander_id
	   ,is_active
       ,@user_id
       ,GETDATE()
    FROM @tt
    WHERE wing_id IS NULL 
	and wing_code IS NOT NULL
	and wing_name IS NOT NULL;
END





