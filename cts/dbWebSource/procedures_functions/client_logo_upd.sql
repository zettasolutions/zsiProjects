
CREATE PROCEDURE [dbo].[client_logo_upd] (
  @client_image    nvarchar(100) = null
 ,@style_css       nvarchar(max)=null
 ,@is_edited       char(1)
 ,@user_id         int=null
)
as
BEGIN
  SET NOCOUNT ON
  DECLARE @id int
  UPDATE dbo.clients SET client_image = @client_image          
                         ,style_css = @style_css 
						 ,updated_by = @user_id
						 ,updated_date = GETDATE()
		WHERE ISNULL(@is_edited, 'N') = 'Y'
 END