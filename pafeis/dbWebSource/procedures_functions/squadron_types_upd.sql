
CREATE PROCEDURE [dbo].[squadron_types_upd]
(
    @tt    squadron_types_tt READONLY
   ,@user_id int
)
AS

BEGIN
   SET NOCOUNT ON
-- Update Process
    UPDATE a 
    SET  squadron_type	        = b.squadron_type
		,is_active				= b.is_active
        ,updated_by				= @user_id
        ,updated_date			= GETDATE()
    FROM dbo.squadron_types a INNER JOIN @tt b
    ON a.squadron_type_id = b.squadron_type_id
    WHERE (
            isnull(a.squadron_type,'')		<> isnull(b.squadron_type,'')  
		OR	isnull(a.is_active,'')			<> isnull(b.is_active,'')  
	)
	   
-- Insert Process
    INSERT INTO dbo.squadron_types (
	     squadron_type
		,is_active
        ,created_by
        ,created_date
        )
    SELECT 
	    squadron_type
	   ,is_active
       ,@user_id
       ,GETDATE()
    FROM @tt
    WHERE squadron_type_id IS NULL
	  AND squadron_type IS NOT NULL;
END


