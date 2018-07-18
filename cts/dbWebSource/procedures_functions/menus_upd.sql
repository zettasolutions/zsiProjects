

create PROCEDURE [dbo].[menus_upd]
(
    @tt    menus_tt READONLY
   ,@user_id int
)
AS
-- Update Process
	UPDATE a 
		   SET 
	   	      pmenu_id	   = b.pmenu_id
			 ,icon         = b.icon
			 ,menu_name	   = b.menu_name
			 ,page_id	   = b.page_id
	 		 ,seq_no       = b.seq_no
			 ,is_default   = b.is_default
	   	     ,updated_by   = @user_id
			 ,updated_date = GETDATE()
       FROM dbo.menus a INNER JOIN @tt b
	     ON a.menu_id = b.menu_id 
	    WHERE isnull(b.is_edited,'N') = 'Y';
		 
-- Insert Process
	INSERT INTO menus (
         menu_name
		,icon
		,pmenu_id
		,page_id
		,seq_no
		,created_by
		,created_date
    )
	SELECT 
		 menu_name
		,icon
		,pmenu_id
		,page_id
		,seq_no
	    ,@user_id
	    , GETDATE()
	FROM @tt 
	WHERE menu_id IS NULL
      AND menu_name IS NOT NULL;
