CREATE PROCEDURE [dbo].[denomination_ref_upd]
(
    @tt    denomination_ref_tt READONLY
   ,@user_id int
)
AS

BEGIN
-- Update Process
    UPDATE a 
        SET denomination  = b.denomination
            ,updated_by   = @user_id
            ,updated_date = GETDATE()
     FROM dbo.denomination_ref a INNER JOIN @tt b
        ON a.denomination_id = b.denomination_id 
       WHERE (
				isnull(a.denomination,0) <> isnull(b.denomination,0)   
	   )

-- Insert Process

    INSERT INTO denomination_ref (
         denomination
        ,created_by
        ,created_date
        )
    SELECT 
        denomination
       ,@user_id
       ,GETDATE()
    FROM @tt
    WHERE denomination_id IS NULL
END


  



