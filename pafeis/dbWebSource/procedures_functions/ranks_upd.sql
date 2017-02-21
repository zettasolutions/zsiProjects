
CREATE PROCEDURE [dbo].[ranks_upd]
(
    @tt    ranks_tt READONLY
   ,@user_id int
)
AS

BEGIN
   SET NOCOUNT ON
-- Update Process
    UPDATE a 
    SET  rank_code  	= b.rank_code 
		,rank_desc		= b.rank_desc	
		,rank_level		= b.rank_level
		,is_active		= b.is_active
        ,updated_by		= @user_id
        ,updated_date	= GETDATE()
    FROM dbo.ranks a INNER JOIN @tt b
    ON a.rank_id = b.rank_id
    WHERE (
			isnull(a.rank_code,'')	<> isnull(b.rank_code,'')  
		OR	isnull(a.rank_desc,'')	<> isnull(b.rank_desc,'') 
		OR	isnull(a.rank_level,0)	<> isnull(b.rank_level,0) 
		OR	isnull(a.is_active,'')	<> isnull(b.is_active,'')  
	)
	   
-- Insert Process
    INSERT INTO dbo.ranks (
         rank_code 
		,rank_desc	
		,rank_level
		,is_active
        ,created_by
        ,created_date
        )
    SELECT 
        rank_code 
	   ,rank_desc	
	   ,rank_level
	   ,is_active
       ,@user_id
       ,GETDATE()
    FROM @tt
    WHERE rank_id IS NULL
	  AND rank_code IS NOT NULL;
END

