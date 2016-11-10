
CREATE PROCEDURE [dbo].[squadrons_upd]
(
    @tt    squadrons_tt READONLY
   ,@user_id int
)
AS

BEGIN
-- Update Process
    UPDATE a 
    SET  wing_id				= b.wing_id
	    ,squadron_type_id		= b.squadron_type_id
		,squadron_code			= b.squadron_code
		,squadron_name			= b.squadron_name
		,squadron_commander_id  = b.squadron_commander_id
		,squadron_full_address  = b.squadron_full_address
		,is_active				= b.is_active
        ,updated_by				= @user_id
        ,updated_date			= GETDATE()
    FROM dbo.squadrons a INNER JOIN @tt b
    ON a.squadron_id = b.squadron_id
    WHERE (
			isnull(a.wing_id,0)				    <> isnull(b.wing_id,0)  
        OR  isnull(a.squadron_type_id,0)		<> isnull(b.squadron_type_id,0)  
		OR	isnull(a.squadron_code,'')		    <> isnull(b.squadron_code,'')  
		OR	isnull(a.squadron_name,'')		    <> isnull(b.squadron_name,'')   
		OR	isnull(a.squadron_commander_id,0)	<> isnull(b.squadron_commander_id,0)   
		OR	isnull(a.squadron_full_address,'')	<> isnull(b.squadron_full_address,'')  
		OR	isnull(a.is_active,'')			    <> isnull(b.is_active,'')  
	)
	   
-- Insert Process
    INSERT INTO squadrons (
         wing_id 
		,squadron_type_id
		,squadron_code
		,squadron_name
		,squadron_commander_id
		,squadron_full_address
		,is_active
        ,created_by
        ,created_date
        )
    SELECT 
        wing_id 
	   ,squadron_type_id
	   ,squadron_code	
	   ,squadron_name
	   ,squadron_commander_id
	   ,squadron_full_address
	   ,is_active
       ,@user_id
       ,GETDATE()
    FROM @tt
    WHERE squadron_id IS NULL
	and wing_id       IS NOT NULL
	and squadron_code IS NOT NULL;
END



