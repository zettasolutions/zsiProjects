CREATE PROCEDURE [dbo].[locations_upd]
(
    @tt    locations_tt READONLY
   ,@user_id int
)
AS

BEGIN
-- Update Process
    UPDATE a 
        SET  location  = b.location
            ,updated_by   = @user_id
            ,updated_date = GETDATE()
     FROM dbo.locations a INNER JOIN @tt b
        ON a.loc_id = b.loc_id  
       WHERE (
				isnull(a.location,'') <> isnull(b.location,'')   
	   )

-- Insert Process

    INSERT INTO locations (
         location
        ,created_by
        ,created_date
        )
    SELECT 
        location
       ,@user_id
       ,GETDATE()
    FROM @tt
    WHERE loc_id IS NULL
END


  




